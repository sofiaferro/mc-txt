import React, { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';

export default function Content({ onNext, getWords, getLines, currentStep, currentLines, currentWords, setCurrentStep }) {

    function clearInput() {
        var userStructure = [...document.getElementsByClassName('structure')];
        var words = userStructure[0];
        var lines = userStructure[1];
        if (words.value || lines.value) {
            setShowModal2(true);
        } else {
            setShowModal3(true);
        }
    };

    function deleteData() {
        var userStructure = [...document.getElementsByClassName('structure')];
        for (var i = 0; i < userStructure.length; i++) {
            userStructure[i].value = '';
        }
        setShowModal2(false);
    }

    async function getData() {
        var userStructure = document.getElementsByClassName('structure');
        var words = userStructure[0];
        var lines = userStructure[1];

        if (!words.value || !lines.value) {
            setShowModal1(true);
        } else if (words.value && lines.value) {
            onNext();
        }
    };

    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);

    return (
        <div id='content' className='content'>
            <h1 className='title' onClick={() => setCurrentStep(0)}>mc-txt</h1>
            <Modal isOpen={showModal1} className="nes-dialog" >
                <div id="dialog-default">
                    <p className="title">oops...</p>
                    <p>parece que te faltó escribir algo</p>
                    <div className="dialog-menu">
                        <button className="nes-btn is-warning" onClick={() => setShowModal1(false)}>ok</button>
                    </div>
                </div>
            </Modal >
            <Modal isOpen={showModal2} ariaHideApp={false} className="nes-dialog" >
                <div id="dialog-default">
                    <p className="title">vas a eliminar los datos</p>
                    <p>¿estás segur@?</p>
                    <div className="dialog-menu">
                        <button className="nes-btn is-error" onClick={() => setShowModal2(false)}>no</button>
                        <button className="nes-btn is-success" onClick={deleteData}>sí</button>
                    </div>
                </div>
            </Modal >
            <Modal isOpen={showModal3} className="nes-dialog" >
                <div id="dialog-default">
                    <p className="title">oops...</p>
                    <p>los campos están vacíos</p>
                    <div className="dialog-menu">
                        <button className="nes-btn is-warning" onClick={() => setShowModal3(false)}>ok</button>
                    </div>
                </div>
            </Modal >
            <div className='div-container nes-container with-title'>
                <p className='title'>estructura</p>
                <div>
                    <label>palabras:</label>
                    <input id='words' className='structure nes-input' defaultValue={currentWords} onChange={getWords} placeholder='?????' />
                </div>
                <div className='div-container'>
                    <label>líneas:</label>
                    <input id='lines' className='structure nes-input' defaultValue={currentLines} onChange={getLines} placeholder='?????' />
                </div>
            </div>
            <div className='controls'>
                <label>
                    <input id='clearStructure' type='radio' className='nes-radio' name='structure' />
                    <span className='nes-text' onClick={clearInput}>borrar</span>
                </label>
                <label>
                    <input type='radio' className='nes-radio' name='structure' defaultChecked />
                    <span className='nes-text' onClick={getData}>continuar</span>
                </label>
            </div>
        </div>
    );
}