import { useRef, useState } from 'react';
import '../index.css';
import Modal from 'react-modal';
import { pressable } from '../lib/a11y';
import { useFitText } from '../lib/fitText';

export default function Text({ text, setStep, onRegenerate }) {
  const [showNoText, setShowNoText] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const boxRef = useRef(null);
  const textRef = useRef(null);
  useFitText(textRef, boxRef, text);

  async function copyText() {
    if (!text) {
      setShowNoText(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setShowCopied(true);
    } catch {
      setShowNoText(true);
    }
  }

  return (
    <div id="content" className="content">
      <h1 className="title" {...pressable(() => setStep(0))}>
        mc-txt
      </h1>
      <Modal isOpen={showNoText} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">oops...</p>
          <p>no hay texto para copiar</p>
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowNoText(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showCopied} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">¡listo!</p>
          <p>texto copiado al portapapeles</p>
          <div className="dialog-menu">
            <button className="nes-btn is-success" onClick={() => setShowCopied(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>
      <div id="contenedor-texto" className="div-container nes-container with-title">
        <p className="title">txt</p>
        <span
          className="back-link"
          aria-label="volver a la estructura"
          {...pressable(() => setStep(2))}
        >
          volver
        </span>
        <div id="typewriter" ref={boxRef}>
          <p id="markovResults" ref={textRef}>
            {text.split('\n').map((line, i) => (
              <span key={i} className="verse">
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="controls">
        <label>
          <input
            id="generateText"
            type="radio"
            className="generateText nes-radio"
            name="botones"
          />
          <span {...pressable(onRegenerate)}>generar texto nuevo</span>
        </label>
        <label>
          <input
            id="copyText"
            type="radio"
            className="nes-radio"
            name="botones"
            defaultChecked
          />
          <span {...pressable(copyText)}>copiar texto</span>
        </label>
      </div>
    </div>
  );
}
