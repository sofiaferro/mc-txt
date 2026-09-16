import { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';
import { fetchCorpus } from '../lib/wikipedia';
import { buildModel } from '../lib/markov';
import { pressable } from '../lib/a11y';

const FIELDS = [
  { id: 'wish', placeholder: 'un deseo' },
  { id: 'fear', placeholder: 'un miedo' },
  { id: 'smell', placeholder: 'un olor' },
  { id: 'color', placeholder: 'un color' },
  { id: 'passion', placeholder: 'una pasión' },
];

const EMPTY_VALUES = Object.fromEntries(FIELDS.map((f) => [f.id, '']));

export default function Input({ setStep, setModel, setTerms }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showMissing, setShowMissing] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const setValue = (id) => (event) =>
    setValues((prev) => ({ ...prev, [id]: event.target.value }));

  function clearInput() {
    const isEmpty = FIELDS.every(({ id }) => values[id].trim() === '');
    if (isEmpty) setShowEmpty(true);
    else setShowConfirmDelete(true);
  }

  function deleteData() {
    setValues(EMPTY_VALUES);
    setShowConfirmDelete(false);
  }

  async function generateModel() {
    if (loading) return;
    const terms = FIELDS.map(({ id }) => values[id].trim());
    if (terms.some((term) => term === '')) {
      setShowMissing(true);
      return;
    }
    setLoading(true);
    try {
      const corpus = await fetchCorpus(terms);
      const model = buildModel(corpus);
      if (model.starts.length === 0) {
        setShowNoResults(true);
        return;
      }
      setModel(model);
      setTerms(terms);
      setStep(2);
    } catch {
      setShowNoResults(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="content" className="content">
      <h1 className="title" {...pressable(() => setStep(0))}>
        mc-txt
      </h1>
      <Modal isOpen={showEmpty} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">oops...</p>
          <p>todavía no cargaste ningún dato</p>
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowEmpty(false)}>
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
      <Modal isOpen={showMissing} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">oops...</p>
          <p>parece que te faltó escribir algo</p>
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowMissing(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showNoResults} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="title">oops...</p>
          <p>mc-txt no pudo generar texto nuevo</p>
          <p>intentalo otra vez con inputs nuevos :)</p>
          <div className="dialog-menu">
            <button
              className="nes-btn is-warning"
              onClick={() => setShowNoResults(false)}
            >
              ok
            </button>
          </div>
        </div>
      </Modal>
      <div id="contenedor-input" className="div-container nes-container with-title">
        <p className="title">input</p>
        {FIELDS.map(({ id, placeholder }) => (
          <input
            key={id}
            id={id}
            value={values[id]}
            onChange={setValue(id)}
            type="text"
            className="input nes-input"
            placeholder={placeholder}
          />
        ))}
      </div>
      <div className="controls">
        <label>
          <input id="clearInput" type="radio" className="nes-radio" name="text" />
          <span className="nes-text" {...pressable(clearInput)}>
            borrar
          </span>
        </label>
        <label>
          <input
            type="radio"
            className="nes-radio generateText"
            name="text"
            defaultChecked
          />
          <span className="nes-text" {...pressable(generateModel)}>
            {loading ? 'cargando...' : 'continuar'}
          </span>
        </label>
      </div>
    </div>
  );
}
