/// <reference types="vite/client" />

declare module "hello-codes" {
  export interface CodeInfo {
    lang: string,
    matchedLine: string,
    linesAbove: string[],
    linesBelow: string[],
    bg: string,
  }

  declare const kv: Array<CodeInfo>
  export default kv
}
