import React, { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';

export default function Menu({ currentStep, setCurrentStep }) {

    const [showTips, setShowTips] = useState(false);
    const [showReset, setShowReset] = useState(false);
    const [showAbout, setShowAbout] = useState(false);

    var tipsTitle;
    var tipsContent;
    var icons;
    var menu;

    function checkComponent() {
        if (currentStep === 1 || currentStep === 2) {
            menu = <div className='toggle-menu'>
                <button type="button" className="nes-btn is-primary" onClick={() => setShowTips(true)} >tips</button>
                <button type="button" className="nes-btn is-error" onClick={() => setShowReset(true)}>reset</button>
                <button type="button" className="nes-btn is-success" onClick={() => setShowAbout(true)}>sobre mc-txt</button>
            </div>

            if (currentStep === 2) {
                tipsTitle = 'estructura nivel experto';
                tipsContent = <div className="lists">
                    <ul className="nes-list">
                        <li>que el número de palabras sea divisible por 3 y menor a 10</li>
                        <li>que el número de líneas sea igual o menor a 10</li>
                    </ul>
                </div>
                icons = <div className='coin-icons-container'>
                    <i className="nes-icon coin is-medium"></i>
                    <i className="nes-icon coin is-medium"></i>
                    <i className="nes-icon coin is-medium"></i>
                </div>
            } else if (currentStep === 1) {
                tipsTitle = 'inputs nivel experto';
                tipsContent = <div className="lists">
                    <ul className="nes-list">
                        <li>si ponés dos opciones por input, mejora el resultado</li>
                        <li>otra pista: que sean un sustantivo + un adjetivo</li>
                    </ul>
                </div>
                icons = <div className='coin-icons-container'>
                    <i className="nes-jp-logo is-large"></i>
                </div>
            }
        } else if (currentStep === 3) {
            menu = <div className='toggle-menu'>
                <button type="button" className="nes-btn is-error" onClick={() => setShowReset(true)}>reset</button>
                <button type="button" className="nes-btn is-success" onClick={() => {
                    setShowAbout(true);
                }}>sobre mc-txt</button>
            </div>
        }
    }

    checkComponent();

    return (
        <div className='content'>
            <Modal isOpen={showTips} className="nes-dialog" >
                <div id="dialog-default">
                    {icons}
                    <p className='dialog-title'>{tipsTitle}</p>
                    {tipsContent}
                    <div className="dialog-menu">
                        <button className="nes-btn is-warning" onClick={() => setShowTips(false)}>ok</button>
                    </div>
                </div>

            </Modal>
            <Modal isOpen={showReset} ariaHideApp={false} className="nes-dialog" >
                <div id="dialog-default">
                    <p className="dialog-title">vas a resetear mc-txt</p>
                    <p>¿estás segur@?</p>
                    <div className="dialog-menu">
                        <button className="nes-btn is-error" onClick={() => setShowReset(false)}>no</button>
                        <button className="nes-btn is-success" onClick={() => setCurrentStep(0)}>sí</button>
                    </div>
                </div>
            </Modal >
            <Modal isOpen={showAbout} className="nes-dialog about">
                <div id="dialog-default">
                    <h1 className="nes-text is-warning"># # #</h1>
                    <p>¡Hola! Me llamo Sofía Ferro, soy Desarrolladora Web Full Stack. <br /> Mc-txt es un generador de texto que surgió a partir del taller "Escribir como máquinas", brindado por Matías Buonfrate y Gerardo Montoya en el Cultural Morán (oct, 2020). <br /> A partir de búsquedas en la API de Wikipedia, mc-txt recibe extractos relacionados a los inputs y utiliza cadenas de Markov para generar texto nuevo.<br /> Si tenés dudas o sugerencias, podés contactarme por cualquiera de estas vías:</p>
                    <div className='icons-container'>
                        <i className="nes-icon instagram is-medium" onClick={() => { window.open("https://instagram.com/ferrosof", "_blank"); }}></i>
                        <i className="nes-icon gmail is-medium" onClick={() => { window.open("mailto:sofiferro89@gmail.com") }}></i>
                    </div>
                    <div className="dialog-menu">
                        <button className="nes-btn is-warning" onClick={() => setShowAbout(false)}>ok</button>
                    </div>
                </div>
            </Modal >

            <div className='div-container nes-container with-title'>
                <p className='title'>menú</p>
                {menu}
            </div>
        </div>
    );
}