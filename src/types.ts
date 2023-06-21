/** Allowed data input types for encoding */
export type SupportedInput = string | Uint8Array | ArrayBuffer;

/** Output format */
export enum OutputFormat {
  string = "string",
  Uint8Array = "Uint8Array",
  ArrayBuffer = "ArrayBuffer",
}
Object.freeze(OutputFormat);

/** Tuple of characters used for encoding/decoding */
export type DecodedTuple = [number, number, number, number, number];
