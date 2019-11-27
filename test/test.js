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

describe("BubbleBabble", () => {
  describe("#encode()", () => {
    it("should encode a buffer", () =>
      test_vectors.forEach(test =>
        encode(Buffer.from(test.ascii)).should.equal(test.encoding)
      )
    );

    it("should encode a string", () =>
      test_vectors.forEach(test =>
        encode(test.ascii, "ascii").should.equal(test.encoding)
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
        Buffer.isBuffer(decoded).should.be.true;

        decoded.toString().should.equal(test.ascii);
      });
    });

    it("should throw exception on corrupt input", () => {
      (() => decode("xesyf-disof-gytuf-katof-movif-baxux")).should.throw;

      (() => decode("xesef-disof-gytuf-katof-movif-baxu")).should.throw;
    });

    it("should be inverse of encoding a string", () => {
      const ascii_input = "Inverse of each other.";

      decode(
        encode(ascii_input)
      ).toString().should.equal(ascii_input);
    });

    it("should be inverse of encoding a buffer", () => {
      const input = Buffer.from("ffffffff","hex");

      decode(encode(input)).equals(input).should.be.true;
    });
  });
});
