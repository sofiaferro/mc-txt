import { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';
import { pressable } from '../lib/a11y';

function tipsFor(step) {
  if (step === 1) {
    return {
      title: 'inputs nivel experto',
      content: (
        <div className="lists">
          <ul className="nes-list">
            <li>cuanto más concretos los inputs, mejor el corpus</li>
            <li>una pista: que sean un sustantivo + un adjetivo</li>
          </ul>
        </div>
      ),
      icons: (
        <div className="coin-icons-container">
          <i className="nes-jp-logo is-large"></i>
        </div>
      ),
    };
  }
  if (step === 2) {
    return {
      title: 'estructura nivel experto',
      content: (
        <div className="lists">
          <ul className="nes-list">
            <li>líneas cortas (3 a 6 palabras) quedan más poéticas</li>
            <li>que el número de líneas sea igual o menor a 10</li>
          </ul>
        </div>
      ),
      icons: (
        <div className="coin-icons-container">
          <i className="nes-icon coin is-medium"></i>
          <i className="nes-icon coin is-medium"></i>
          <i className="nes-icon coin is-medium"></i>
        </div>
      ),
    };
  }
  return null;
}

export default function Menu({ step, setStep }) {
  const [showTips, setShowTips] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const tips = tipsFor(step);

  return (
    <div className="content">
      <Modal isOpen={showTips} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          {tips?.icons}
          <p className="dialog-title">{tips?.title}</p>
          {tips?.content}
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowTips(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showReset} ariaHideApp={false} className="nes-dialog">
        <div id="dialog-default">
          <p className="dialog-title">vas a resetear mc-txt</p>
          <p>¿estás segur@?</p>
          <div className="dialog-menu">
            <button className="nes-btn is-error" onClick={() => setShowReset(false)}>
              no
            </button>
            <button className="nes-btn is-success" onClick={() => setStep(0)}>
              sí
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={showAbout} ariaHideApp={false} className="nes-dialog about">
        <div id="dialog-default">
          <h1 className="nes-text is-warning"># # #</h1>
          <p>
            ¡Hola! Me llamo Sofía Ferro, soy Desarrolladora Web Full Stack. <br />
            Mc-txt es un generador de texto que surgió a partir del taller &ldquo;Escribir
            como máquinas&rdquo;, brindado por Matías Buonfrate y Gerardo Montoya en el
            Cultural Morán (oct, 2020). <br />
            A partir de búsquedas en la API de Wikipedia, mc-txt recibe extractos
            relacionados a los inputs y utiliza cadenas de Markov para generar texto
            nuevo.
            <br />
            Si tenés dudas o sugerencias, podés contactarme por cualquiera de estas
            vías:
          </p>
          <div className="icons-container">
            <i
              className="nes-icon instagram is-medium"
              aria-label="Instagram de Sofía Ferro"
              {...pressable(() => window.open('https://instagram.com/ferrosof', '_blank'))}
            ></i>
            <i
              className="nes-icon gmail is-medium"
              aria-label="Escribir a svf.inbox@gmail.com"
              {...pressable(() => window.open('mailto:svf.inbox@gmail.com'))}
            ></i>
          </div>
          <div className="dialog-menu">
            <button className="nes-btn is-warning" onClick={() => setShowAbout(false)}>
              ok
            </button>
          </div>
        </div>
      </Modal>

      <div className="div-container nes-container with-title">
        <p className="title">menú</p>
        <div className="toggle-menu">
          {tips && (
            <button
              type="button"
              className="nes-btn is-primary"
              onClick={() => setShowTips(true)}
            >
              tips
            </button>
          )}
          <button type="button" className="nes-btn is-error" onClick={() => setShowReset(true)}>
            reset
          </button>
          <button
            type="button"
            className="nes-btn is-success"
            onClick={() => setShowAbout(true)}
          >
            sobre mc-txt
          </button>
        </div>
      </div>
    </div>
  );
}
