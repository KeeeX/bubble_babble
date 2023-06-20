/* eslint-disable no-magic-numbers */
import assert from "node:assert";
import {encode, decode} from "../bubble_babble.js";

const randomInt = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

const LARGEST_BASE = 36;

const randomStr = () => {
  const randomSrc = Math.random().toString(LARGEST_BASE);
  return randomSrc.slice(2, randomInt(0, randomSrc.length));
};

const testVectors = [
  {
    ascii: "",
    encoding: "xexax",
  },
  {
    ascii: "1234567890",
    encoding: "xesef-disof-gytuf-katof-movif-baxux",
  },
  {
    ascii: "Pineapple",
    encoding: "xigak-nyryk-humil-bosek-sonax",
  },
];

const str2abUTF8 = str => new TextEncoder().encode(str).buffer;
const ab2strUTF8 = ab => new TextDecoder().decode(new Uint8Array(ab));

const testEncode = () => {
  it("should encode a buffer", () => testVectors.forEach(fixture => {
    const encoded = encode(str2abUTF8(fixture.ascii));
    assert.deepStrictEqual(encoded, fixture.encoding);
  }));

  it("should encode a string", () => testVectors.forEach(fixture => {
    const encoded = encode(fixture.ascii);
    assert.deepStrictEqual(encoded, fixture.encoding);
  }));

  it("should return a string that starts and begins with \"x\"", () => {
    for (let i = 0; i < 10; ++i) {
      const encoded = encode(randomStr());
      assert.ok(encoded.startsWith("x"));
      assert.ok(encoded.endsWith("x"));
    }
  });

  it("should be the inverse of decoding", () => testVectors.forEach(fixture => {
    const redecoded = encode(decode(fixture.encoding));
    assert.deepStrictEqual(redecoded, fixture.encoding);
  }));
};

const testDecode = () => {
  it("should decode a string and return a buffer", () => testVectors.forEach(fixture => {
    const decoded = decode(fixture.encoding);
    assert(decoded instanceof ArrayBuffer);
    const ascii = ab2strUTF8(decoded);
    assert.deepStrictEqual(ascii, fixture.ascii);
  }));

  it("should throw exception on corrupt input", () => {
    assert.throws(() => decode("xesyf-disof-gytuf-katof-movif-baxux"));
    assert.throws(() => decode("xesef-disof-gytuf-katof-movif-baxu"));
  });

  it("should be inverse of encoding a string", () => {
    const asciiInput = "Inverse of each other.";
    const reinput = ab2strUTF8(decode(encode(asciiInput)));
    assert.deepStrictEqual(reinput, asciiInput);
  });

  it("should accept Uint8Array", () => {
    const input = Uint8Array.from([34, 63, 42, 0, 255]);
    const decoded = decode(encode(input));
    assert.strictEqual(input.length, decoded.byteLength);
    const decodedBytes = new Uint8Array(decoded);
    for (let i = 0; i < decodedBytes.length; ++i) assert.strictEqual(decodedBytes[i], input[i]);
  });

  it("should be inverse of encoding an ArrayBuffer", () => {
    const input = Uint8Array.from([255, 255, 255, 255]).buffer;
    const decoded = decode(encode(input));
    assert.strictEqual(input.byteLength, decoded.byteLength);
    const decodedBytes = new Uint8Array(decoded);
    for (let i = 0; i < decodedBytes.length; ++i) assert.strictEqual(decodedBytes[i], 255);
  });
};

describe("BubbleBabble", () => {
  describe("#encode()", testEncode);
  describe("#decode()", testDecode);
});
