/// <reference types="vite/client" />

declare module "hello-codes" {
  export interface CodeStructure {
    lang: string,
    matchedLine: string,
    linesAbove: string[],
    linesBelow: string[],
  }

  declare const kv: Array<CodeStructure>
  export default kv
}
