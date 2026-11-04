import { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';
import { pressable } from '../lib/a11y';

// Largo de la línea más larga, para achicar la letra en vez de que
// el navegador parta la línea en dos (hasta un mínimo legible).
function longestLine(text) {
  return Math.max(1, ...(text || '').split('\n').map((line) => line.length));
}

export default function Text({ text, setStep, onRegenerate }) {
  const [showNoText, setShowNoText] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

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
      <span
        className="back-link"
        aria-label="volver a la estructura"
        {...pressable(() => setStep(2))}
      >
        &lt; estructura
      </span>
      <div id="contenedor-texto" className="div-container nes-container with-title">
        <p className="title">txt</p>
        <div id="typewriter">
          <p id="markovResults" style={{ '--chars': longestLine(text) }}>
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
