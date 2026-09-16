import { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';
import { pressable } from '../lib/a11y';

export default function Content({ setStep, words, lines, setWords, setLines, onContinue }) {
  const [showMissing, setShowMissing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);

  const isValid = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

  function clearInput() {
    if (words || lines) setShowConfirmDelete(true);
    else setShowEmpty(true);
  }

  function deleteData() {
    setWords('');
    setLines('');
    setShowConfirmDelete(false);
  }

  function continueNext() {
    if (!isValid(words) || !isValid(lines)) {
      setShowMissing(true);
      return;
    }
    onContinue(words, lines);
  }

  return (
    <div id="content" className="content">
      <h1 className="title" {...pressable(() => setStep(0))}>
        mc-txt
      </h1>
      <Modal isOpen={showMissing} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">oops...</p>
          <p>necesito dos números mayores a cero</p>
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowMissing(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showConfirmDelete} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">vas a eliminar los datos</p>
          <p>¿estás segur@?</p>
          <div className="dialog-menu">
            <button className="nes-btn is-error" onClick={() => setShowConfirmDelete(false)}>
              no
            </button>
            <button className="nes-btn is-success" onClick={deleteData}>
              sí
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showEmpty} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">oops...</p>
          <p>los campos están vacíos</p>
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowEmpty(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>
      <div className="div-container nes-container with-title">
        <p className="title">estructura</p>
        <div>
          <label>palabras:</label>
          <input
            id="words"
            className="structure nes-input"
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder="?????"
          />
        </div>
        <div className="div-container">
          <label>líneas:</label>
          <input
            id="lines"
            className="structure nes-input"
            value={lines}
            onChange={(e) => setLines(e.target.value)}
            placeholder="?????"
          />
        </div>
      </div>
      <div className="controls">
        <label>
          <input id="clearStructure" type="radio" className="nes-radio" name="structure" />
          <span className="nes-text" {...pressable(clearInput)}>
            borrar
          </span>
        </label>
        <label>
          <input type="radio" className="nes-radio" name="structure" defaultChecked />
          <span className="nes-text" {...pressable(continueNext)}>
            continuar
          </span>
        </label>
      </div>
    </div>
  );
}
