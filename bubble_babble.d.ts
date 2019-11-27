declare module "@keeex/bubble_babble" {
  export function encode(data: ArrayBuffer | Buffer | string): string;
  export function decode(data: string): Buffer;
}
