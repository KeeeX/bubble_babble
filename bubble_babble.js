const vowels = "aeiouy";
const vowelsCount = vowels.length;
const usedConsonants = "bcdfghklmnprstv";
const evenConsonant = "z";
const endsConsonant = "x";
const consonants = `${usedConsonants}${evenConsonant}${endsConsonant}`;
// Index of "x" in consonnants
const endIndex = 16;

/** Get an Uint8Array representation from input */
const getBuf8FromInput = input => {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (typeof input === "string") return new TextEncoder().encode(input);
  throw new Error("Unsupported input");
};

const oddPartial = (rawByte, checksum) => {
  /* eslint-disable no-magic-numbers */
  const a = (((rawByte >> 6) & 3) + checksum) % vowelsCount;
  const b = (rawByte >> 2) & 15;
  const c = ((rawByte & 3) + Math.floor(checksum / 6)) % vowelsCount;
  /* eslint-enable no-magic-numbers */
  return vowels[a] + consonants[b] + vowels[c];
};

const evenPartial = checksum => {
  /* eslint-disable no-magic-numbers */
  const a = checksum % vowelsCount;
  const c = Math.floor(checksum / 6);
  /* eslint-enable no-magic-numbers */
  return vowels[a] + endsConsonant + vowels[c];
};

/* eslint-disable no-magic-numbers */
const nextChecksum = (checksum, byte1, byte2) => ((checksum * 5) + (byte1 * 7) + byte2) % 36;
/* eslint-enable no-magic-numbers */

/** Encode a buffer/string into a bubble babble string */
export const encode = input => {
  const inputBytes = getBuf8FromInput(input);
  const len = inputBytes.length;
  let result = endsConsonant;
  let checksum = 1;
  let i = 0;
  // create full tuples
  while (i + 1 < len) {
    const byte1 = inputBytes[i++];
    const byte2 = inputBytes[i++];
    result += oddPartial(byte1, checksum);

    /* eslint-disable no-magic-numbers */
    const d = (byte2 >> 4) & 15;
    const e = byte2 & 15;
    /* eslint-enable no-magic-numbers */

    result = `${result}${consonants[d]}-${consonants[e]}`;
    checksum = nextChecksum(checksum, byte1, byte2);
  }
  // handle partial tuple
  if (i < len) {
    const byte1 = inputBytes[i];
    result += oddPartial(byte1, checksum);
  } else {
    result += evenPartial(checksum);
  }
  result += endsConsonant;
  return result;
};

const decodeTuple = asciiTuple => ([
  vowels.indexOf(asciiTuple[0]),
  consonants.indexOf(asciiTuple[1]),
  vowels.indexOf(asciiTuple[2]),
  consonants.indexOf(asciiTuple[3]),
  consonants.indexOf(asciiTuple[5]),
]);

const decode3PartByte = (a, b, c, checksum) => {
  /* eslint-disable no-magic-numbers */
  const high = (a - (checksum % 6) + 6) % 6;
  const mid = b;
  const low = (c - (Math.floor(checksum / 6) % 6) + 6) % 6;
  if (high >= 4 || low >= 4) throw new Error("Corrupt string");
  return (high << 6) | (mid << 2) | low;
  /* eslint-enable no-magic-numbers */
};

/* eslint-disable no-magic-numbers */
const decode2PartByte = (d, e) => (d << 4) | e;
/* eslint-enable no-magic-numbers */

export const decode = input => {
  if (input[0] !== endsConsonant || input.slice(-1) !== endsConsonant) {
    throw new Error("Corrupt string");
  }
  // eslint-disable-next-line require-unicode-regexp
  const asciiTuples = input.slice(1, -1).match(/.{3,6}/g);
  const len = asciiTuples ? asciiTuples.length : 0;
  const charCodes = [];
  let checksum = 1;
  let tuple;
  // handle full tuples
  for (let i = 0; i < len - 1; ++i) {
    tuple = decodeTuple(asciiTuples[i]);
    const byte1 = decode3PartByte(tuple[0], tuple[1], tuple[2], checksum);
    const byte2 = decode2PartByte(tuple[3], tuple[4]);
    checksum = nextChecksum(checksum, byte1, byte2);
    charCodes.push(byte1);
    charCodes.push(byte2);
  }

  // handle partial tuple
  tuple = decodeTuple(asciiTuples[len - 1]);
  if (tuple[1] === endIndex) {
    /* eslint-disable no-magic-numbers */
    if (tuple[0] !== checksum % 6 || tuple[2] !== Math.floor(checksum / 6)) {
      throw new Error("Corrupt string");
    }
    /* eslint-enable no-magic-numbers */
  } else {
    const byte1 = decode3PartByte(tuple[0], tuple[1], tuple[2], checksum);
    charCodes.push(byte1);
  }

  return Uint8Array.from(charCodes).buffer;
};
