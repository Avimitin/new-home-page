import { useEffect, useState } from 'react'
import allCodes, { CodeInfo } from "hello-codes"
import "./index.css"
import chroma from "chroma-js";

const CODE_BACKGROUND_CACHE = new Map();

function DimedCodePart(data: { code: string }) {
  const { code } = data;

  return (<div className="dimed-code">
    <span>{code}</span>
  </div>)
}

function HighlightedCodePart(data: { code: string }) {
  const { code } = data;

  return (<div className='highlighted-code'>
    <span>{code}</span>
  </div>)
}

interface CodeContainerOpt {
  codeInfo: CodeInfo
  onTransitionEnd?: React.TransitionEventHandler<HTMLDivElement>,
}

function CodeContainer({ codeInfo, onTransitionEnd }: CodeContainerOpt) {
  const { lang, linesAbove, matchedLine, linesBelow } = codeInfo;
  return (
    <div className={`code-container lang-${lang}`}>
      <div className={`code-source ${onTransitionEnd ? "fading" : "display"}`} onTransitionEnd={onTransitionEnd}>
        <pre>
          <DimedCodePart code={linesAbove.join("\n")} />
          <HighlightedCodePart code={matchedLine} />
          <DimedCodePart code={linesBelow.join("\n")} />
        </pre>
      </div>
    </div>
  )
}

function randRadialGradientGroup(bg: string, amount: number): string {
  const rand = () => {
    return Math.floor(Math.random() * 100);
  }
  return chroma
    .scale([chroma(bg).darken(2), chroma.random()])
    .mode("lch")
    .colors(amount)
    .map(color =>
      `radial-gradient(at ${rand()}% ${rand()}%, ${color} 0px, transparent 50%)`
    )
    .join(",")
}

function generateBackground(bg: string): React.CSSProperties {
  const backgroundImage = CODE_BACKGROUND_CACHE.get(bg) || randRadialGradientGroup(bg, 4);
  CODE_BACKGROUND_CACHE.set(bg, backgroundImage);
  return {
    backgroundColor: bg,
    backgroundImage,
  }
}

function CodeBackground({codeInfo, onTransitionEnd}: CodeContainerOpt) {
  return (<div className="code-background" style={generateBackground(codeInfo.bg)}>
    <CodeContainer codeInfo={codeInfo} onTransitionEnd={onTransitionEnd}/>
  </div>)
}

function DrawRoot() {
  const [[prev, current], setNext] = useState([-1, 0]);
  const total = allCodes.length;
  const [doFade, setDoFade] = useState(true);

  const onTransitionEnd = () => {
    setDoFade(false);
  }

  useEffect(() => {
    setTimeout(() => {
      if (current == total - 1) {
        setNext([total - 1, 0])
      } else {
        setNext([current, current + 1])
      }

      setDoFade(true)
    }, 10000)
  }, [current])

  const prevCodes = allCodes[prev];
  if (prevCodes && doFade) {
    return (<CodeBackground codeInfo={prevCodes} onTransitionEnd={onTransitionEnd}/>)
  }

  const currentCodes = allCodes[current];
  return (
    <CodeBackground codeInfo={currentCodes} />
  )

}

function App() {
  return <div className='draw-root'>
    <DrawRoot />
  </div>
}

export default App
