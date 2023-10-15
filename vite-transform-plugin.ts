import fs from "node:fs";

export function code_transform (dir: string) {
  return {
    name: 'code-transform',
    resolveId(id: string) {
      if (id === "hello-codes") {
        return id
      }
    },

    async load (id: string) {
      if (!id.match(/hello-codes/)) {
        return
      }

      const allFiles = fs.readdirSync(dir).filter(p => p.startsWith("hello"))
      if (allFiles.length === 0) {
        console.warn(`No code file found from ${dir}, this is weird`);
        return
      }

      const ext2lang = {
        "rs": "rust",
        "ts": "typescript",
        "js": "javascript",
      };

      const result = allFiles.map(file => {
        const rawStr = fs.readFileSync(`${dir}/${file}`, "utf-8");
        const pattern = "Hello, here is sh1marin."

        const lineNum = rawStr.split("\n").findIndex((orig) => orig.includes(pattern))
        const linesAbove = rawStr.split("\n").slice(0, lineNum)
        const linesBelow = rawStr.split("\n").slice(lineNum + 1)
        const matchedLine = rawStr.split("\n").at(lineNum)

        const ext = file.split(".").at(1)
        return {
          lang: ext2lang[ext],
          matchedLine,
          linesAbove,
          linesBelow,
        }
      })

      return `export default ${JSON.stringify(result)}`
    }
  }
}
