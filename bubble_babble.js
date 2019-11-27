/*eslint-env node */
const vowels = "aeiouy";
const consonants = "bcdfghklmnprstvzx";

/** Get an Uint8Array representation from input */
const get_bytes_from_input = input => {
  if (input instanceof Uint8Array) {
    return input;
  }
  if (input instanceof ArrayBuffer) {
    return new Uint8Array(input);
  }
  if (typeof input === "string") {
    return new TextEncoder().encode(input);
  }
  throw new Error("Unsupported input");
};

/** Encode a buffer/string into a bubble babble string */
export const encode = input => {
  const inputBytes = get_bytes_from_input(input);

  let result = "x";
  let checksum = 1;
  let len = inputBytes.length;
  let i;

  // create full tuples
  for (i = 0; i + 1 < len; i += 2) {
    const byte1 = inputBytes[i];
    result += odd_partial(byte1, checksum);

    const byte2 = inputBytes[i + 1];
    const d = (byte2 >> 4) & 15;
    const e = byte2 & 15;

    result += consonants.charAt(d) + "-" + consonants.charAt(e);

    checksum = next_checksum(checksum, byte1, byte2);
  }

  // handle partial tuple
  if (i < len) {
    const byte1 = inputBytes[i];
    result += odd_partial(byte1, checksum);
  } else {
    result += even_partial(checksum);
  }

  result += "x";
  return result;
};

const odd_partial = (raw_byte, checksum) => {
  const a = (((raw_byte >> 6) & 3) + checksum) % 6;
  const b = (raw_byte >> 2) & 15;
  const c = ((raw_byte & 3) + Math.floor(checksum / 6)) % 6;

  return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
};

const even_partial = checksum => {
  const a = checksum % 6;
  const b = 16;
  const c = Math.floor(checksum / 6);

  return vowels.charAt(a) + consonants.charAt(b) + vowels.charAt(c);
};

export const decode = input => {
  if (input.substr(0, 1) !== "x" ||
      input.substr(-1, 1) !== "x") {
    throw new Error("Corrupt string");
  }

  const ascii_tuples = input.substring(1, input.length - 1).match(/.{3,6}/g);
  const len = ascii_tuples ? ascii_tuples.length : 0;
  const char_codes = [];
  let checksum = 1;
  let tuple;

  // handle full tuples
  for (let i = 0; i < len - 1; ++i) {
    tuple = decode_tuple(ascii_tuples[i]);

    const byte1 = decode_3part_byte(tuple[0], tuple[1], tuple[2], checksum);
    const byte2 = decode_2part_byte(tuple[3], tuple[4]);

    checksum = next_checksum(checksum, byte1, byte2);

    char_codes.push(byte1);
    char_codes.push(byte2);
  }

  // handle partial tuple
  tuple = decode_tuple(ascii_tuples[len - 1]);
  if (tuple[1] === 16) {
    if (tuple[0] !== checksum % 6 ||
        tuple[2] !== Math.floor(checksum / 6)) {
      throw new Error("Corrupt string");
    }
  } else {
    const byte1 = decode_3part_byte(tuple[0], tuple[1], tuple[2], checksum);
    char_codes.push(byte1);
  }

  return Uint8Array.from(char_codes).buffer;
};

const decode_tuple = ascii_tuple => ([
  vowels.indexOf(ascii_tuple[0]),
  consonants.indexOf(ascii_tuple[1]),
  vowels.indexOf(ascii_tuple[2]),
  consonants.indexOf(ascii_tuple[3]),
  consonants.indexOf(ascii_tuple[5]),
]);

const decode_3part_byte = (a, b, c, checksum) => {
  const high = (a - (checksum % 6) + 6) % 6;
  const mid = b;
  const low = (c - (Math.floor(checksum / 6) % 6) + 6) % 6;

  if (high >= 4 || low >= 4) {
    throw new Error("Corrupt string");
  }

  return (high << 6) | (mid << 2) | low;
};

const decode_2part_byte = (d, e) => (d << 4) | e;

const next_checksum = (checksum, byte1, byte2) =>
  ((checksum * 5) + (byte1 * 7) + byte2) % 36;
