/*eslint-env node, mocha */
import "should";
import {encode, decode} from "..";

const random_int = (min, max) => Math.floor(
  Math.random() * (max - min + 1) + min
);

const random_str = () => Math.random().toString(36).substr(
  2,
  random_int(0, 11)
);

const test_vectors = [
  {
    ascii: "",
    encoding: "xexax"
  },
  {
    ascii: "1234567890",
    encoding: "xesef-disof-gytuf-katof-movif-baxux"
  },
  {
    ascii: "Pineapple",
    encoding: "xigak-nyryk-humil-bosek-sonax"
  }
];

const str2abUTF8 = str => new TextEncoder().encode(str).buffer;
const ab2strUTF8 = ab => new TextDecoder().decode(new Uint8Array(ab));

describe("BubbleBabble", () => {
  describe("#encode()", () => {
    it("should encode a buffer", () =>
      test_vectors.forEach(test =>
        encode(str2abUTF8(test.ascii)).should.equal(test.encoding)
      )
    );

    it("should encode a string", () =>
      test_vectors.forEach(test =>
        encode(test.ascii).should.equal(test.encoding)
      )
    );

    it("should return a string that starts and begins with \"x\"", () => {
      for (let i = 0; i < 10; ++i) {
        const encoded = encode(random_str());
        encoded.should.startWith("x");
        encoded.should.endWith("x");
      }
    });

    it("should be the inverse of decoding", () => {
      const encoding = "xesef-disof-gytuf-katof-movif-baxux";
      encode(decode(encoding)).should.equal(encoding);
    });
  });

  describe("#decode()", () => {
    it("should decode a string and return a buffer", () => {
      test_vectors.forEach(test => {
        var decoded = decode(test.encoding);
        decoded.should.be.an.instanceOf(ArrayBuffer);

        ab2strUTF8(decoded).should.equal(test.ascii);
      });
    });

    it("should throw exception on corrupt input", () => {
      (() => decode("xesyf-disof-gytuf-katof-movif-baxux")).should.throw;

      (() => decode("xesef-disof-gytuf-katof-movif-baxu")).should.throw;
    });

    it("should be inverse of encoding a string", () => {
      const ascii_input = "Inverse of each other.";

      ab2strUTF8(decode(
        encode(ascii_input)
      )).should.equal(ascii_input);
    });

    it("should accept Uint8Array", () => {
      const input = Uint8Array.from([34, 63, 42, 0, 255]);
      const decoded = decode(encode(input));
      input.length.should.equal(decoded.byteLength);
      const decodedBytes = new Uint8Array(decoded);
      for (let i = 0; i < decodedBytes.length; ++i) {
        decodedBytes[i].should.equal(input[i]);
      }
    });

    it("should be inverse of encoding an ArrayBuffer", () => {
      const input = Uint8Array.from([255, 255, 255, 255]).buffer;

      const decoded = decode(encode(input));
      input.byteLength.should.equal(decoded.byteLength);
      const decodedBytes = new Uint8Array(decoded);
      for (let i = 0; i < decodedBytes.length; ++i) {
        decodedBytes[i].should.equal(255);
      }
    });
  });
});
