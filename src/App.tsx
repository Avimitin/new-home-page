import { useEffect, useState } from 'react'
import allCodes, { CodeInfo } from "hello-codes"
import "./index.css"

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
  onTransitionEnd: React.TransitionEventHandler<HTMLDivElement> | undefined,
}

function CodeContainer({ codeInfo, onTransitionEnd }: CodeContainerOpt) {
  const { lang, linesAbove, matchedLine, linesBelow } = codeInfo;
  return (
    <div className={`code-container ${onTransitionEnd ? "fading" : "display"}`} onTransitionEnd={onTransitionEnd}>
      <pre className={`lang-${lang}`}>
        <DimedCodePart code={linesAbove.join("\n")} />
        <HighlightedCodePart code={matchedLine} />
        <DimedCodePart code={linesBelow.join("\n")} />
      </pre>
    </div>
  )
}

function randomRadialGradient() {
  const randP = () => {
    return Math.floor(Math.random() * 100);
  }
  const randH = () => {
    return Math.floor(Math.random() * 360);
  }

  return `radial-gradient(at ${randP()}% ${randP()}%, hsla(${randH()}, ${randP()}%, ${randP()}%, 1) 0px, transparent 50%)`
}

function randRadialGradientGroup(amount: number): string {
  return [...Array(amount).keys()].map(_ => randomRadialGradient()).join(",");
}

function generateBackground(bg: string): React.CSSProperties {
  const backgroundImage = CODE_BACKGROUND_CACHE.get(bg) || randRadialGradientGroup(7);
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
    <CodeBackground codeInfo={prevCodes} onTransitionEnd={onTransitionEnd}/>
  }

  const currentCodes = allCodes[current];
  return (<div className="display">
    <CodeBackground codeInfo={currentCodes} onTransitionEnd={undefined} />
  </div>)


}

function App() {
  return <div className='draw-root'>
    <DrawRoot />
  </div>
}

export default App
