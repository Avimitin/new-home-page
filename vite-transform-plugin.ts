import fs from "node:fs";
import { dirname } from "node:path";

interface Option {
  layoutFile: string,
  displayText: string,
}

export function code_transform(option: Option) {
  return {
    name: 'code-transform',
    resolveId(id: string) {
      if (id === "hello-codes") {
        return id
      }
    },

    async load(id: string) {
      if (!id.match(/hello-codes/)) {
        return
      }

      interface CodeLayoutData {
        file: string,
        bg: string,
      }

      const codeLayout: Record<string, CodeLayoutData> = JSON.parse(fs.readFileSync(option.layoutFile, "utf-8"))
      const dir = dirname(option.layoutFile)

      const result = Object.entries(codeLayout).map(([lang, data]) => {
        const rawStr = fs.readFileSync(`${dir}/${data.file}`, "utf-8");
        const pattern = "%ANCHOR%"

        const lineNum = rawStr.split("\n").findIndex((orig) => orig.includes(pattern))
        const linesAbove = rawStr.split("\n").slice(0, lineNum)
        const linesBelow = rawStr.split("\n").slice(lineNum + 1)
        const matchedLine = rawStr.split("\n").at(lineNum).replace("%ANCHOR%", option.displayText)

        return {
          lang,
          matchedLine,
          linesAbove,
          linesBelow,
          bg: data.bg,
        }
      })

      return `export default ${JSON.stringify(result)}`
    }
  }
}
