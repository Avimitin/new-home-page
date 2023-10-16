import { useEffect, useState } from 'react'
import allCodes, { CodeInfo } from "hello-codes"
import "./index.css"

function DimedCodePart(data: { code: string }) {
  const { code } = data;

  return <div className='dimed-code'>
    <span>{code}</span>
  </div>
}

function HighlightedCodePart(data: { code: string }) {
  const { code } = data;

  return <div className='highlighted-code'>
    <span>{code}</span>
  </div>
}

function CodeBanner({ lang, linesAbove, matchedLine, linesBelow }: CodeInfo) {
  return (
    <div className={`lang-${lang}`}>
      <DimedCodePart code={linesAbove.join("\n")} />
      <HighlightedCodePart code={matchedLine} />
      <DimedCodePart code={linesBelow.join("\n")} />
    </div>
  )
}

function CodeBackground({ codeInfo }: { codeInfo: CodeInfo }) {
  return <div className="code-background" style={{ backgroundColor: codeInfo.bg }}>
    <CodeBanner {...codeInfo} />
  </div>
}

function DrawRoot() {
  const [[prev, current], setNext] = useState([-1, 0]);
  const [doFade, setDoFade] = useState(true);
  const total = allCodes.length;

  useEffect(() => {
    setTimeout(() => {
      if (current == total - 1) {
        setNext([total - 1, 0])
      } else {
        setNext([current, current + 1])
      }

      setDoFade(true)
    }, 5000)
  }, [current])

  const prevCodes = allCodes[prev];
  const onTransitionEnd = () => {
    setDoFade(false);
  }
  if (prevCodes && doFade) {
    return (
      <div className="fade" onTransitionEnd={onTransitionEnd}>
        <CodeBackground codeInfo={prevCodes} />
      </div>
    )
  }

  const currentCodes = allCodes[current];
  return (<div className="display">
    <CodeBackground codeInfo={currentCodes} />
  </div>)
}

function App() {
  return <div className='draw-root'>
    <DrawRoot />
  </div>
}

export default App
