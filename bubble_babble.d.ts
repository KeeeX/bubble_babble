declare module "@keeex/bubble_babble" {
  export function encode(data: Uint8Array | ArrayBuffer | string): string;
  export function decode(data: string): ArrayBuffer;
}
