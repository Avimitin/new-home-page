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

interface CodeContainerProps {
  codeInfo: CodeInfo
  onTransitionEnd?: React.TransitionEventHandler<HTMLDivElement>,
}

function CodeContainer({ codeInfo, onTransitionEnd }: CodeContainerProps) {
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

function randRadialGradientGroup(currentBg: string, nextBg: string, amount: number): string {
  const rand = () => {
    return Math.floor(Math.random() * 100);
  }
  return chroma
    .scale([chroma(currentBg), chroma.random(), chroma(nextBg)])
    .mode("lch")
    .colors(amount)
    .map(color =>
      `radial-gradient(at ${rand()}% ${rand()}%, ${color} 0px, transparent 50%)`
    )
    .join(",")
}

function generateBackground([currentBg, nextBg]: string[]): React.CSSProperties {
  const backgroundImage = CODE_BACKGROUND_CACHE.get(currentBg) || randRadialGradientGroup(currentBg, nextBg, 4);
  CODE_BACKGROUND_CACHE.set(currentBg, backgroundImage);
  return {
    backgroundColor: currentBg,
    backgroundImage,
  }
}

interface CodeBackgroundProps extends CodeContainerProps {
  nextBg: string,
}

function CodeBackground({ codeInfo, nextBg, onTransitionEnd }: CodeBackgroundProps) {
  return (<div className="code-background" style={generateBackground([codeInfo.bg, nextBg])}>
    <CodeContainer codeInfo={codeInfo} onTransitionEnd={onTransitionEnd} />
  </div>)
}

function DrawRoot() {
  const [idx, setIndex] = useState(0);
  const [doFade, setDoFade] = useState(false);

  const onTransitionEnd = () => {
    setDoFade(false);
  }

  useEffect(() => {
    setTimeout(() => {
      idx == allCodes.length - 1 ? setIndex(0) : setIndex(idx + 1)
      setDoFade(true)
    }, 10000)
  }, [idx])

  return (doFade
    ? <CodeBackground codeInfo={allCodes[idx - 1 > 0 ? idx - 1 : 0]} nextBg={allCodes[idx].bg} onTransitionEnd={onTransitionEnd} />
    : <CodeBackground codeInfo={allCodes[idx]} nextBg={allCodes[idx + 1 == allCodes.length ? 0 : idx + 1].bg} />)
}

function App() {
  return (<div className='draw-root'>
    <DrawRoot />
  </div>)
}

export default App
