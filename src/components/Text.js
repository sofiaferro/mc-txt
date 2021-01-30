import React, {useState} from 'react';
import '../index.css';
import Modal from 'react-modal';

export default function Text({ currentTxt, currentStep, currentWords, currentLines, setCurrentTxt, currentChain, currentNgram, setCurrentStep }) {

    function copyText() {
        var text = document.getElementById('markovResults').textContent;
        if (!text) {
            setShowModal1(true);
        } else {
            var copyToClipboard = str => {
                const el = document.createElement('textarea');
                el.value = str;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
            };
            copyToClipboard(text);
            setShowModal2(true);
        }
    }

   function markovIt(txt, ngrams) {
            var words = currentWords;
            var lines = currentLines;
            var result = [];

            function random_word(text) {
                return text[Math.floor(Math.random() * text.length)];
            };

            var currentGram = random_word(txt);
            result.push(currentGram);
            for (var i = 0; i < lines * words - 1; i++) {
                var possibilities = ngrams[currentGram];
                if (!possibilities) {
                    break;
                }
                var next = random_word(possibilities);
                result.push(next);
                currentGram = result[i + 1];
            }
            let array = [];
            function splitArray(result) {
                while (result.length > 0) {
                    let arrayElement = result.splice(0, words);
                    array.push(arrayElement.join(' '));
                }
                return array;
            }
            splitArray(result);
            result = array.join(' ');
            setCurrentTxt(result);
    }

    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    return (
        <div id='content' className='content'>
            <h1 className='title' onClick={()=> setCurrentStep(0)}>mc-txt</h1>
            <Modal isOpen={showModal1} ariaHideApp={false} className="nes-dialog" > 
                <div id="dialog-default">
                        <p className="title">oops...</p>
                        <p>no hay texto para copiar</p>
                        <div className="dialog-menu">
                            <button className="nes-btn is-warning" onClick={()=>setShowModal1(false)}>ok</button>
                        </div>
                </div>
                </Modal >
            <Modal isOpen={showModal2} ariaHideApp={false} className="nes-dialog" > 
                <div id="dialog-default">
                        <p className="title">¡listo!</p>
                        <p>texto copiado al portapapeles</p>
                        <div className="dialog-menu">
                            <button className="nes-btn is-success" onClick={()=>setShowModal2(false)}>ok</button>
                        </div>
                </div>
                </Modal >
            <div id="contenedor-texto" className='div-container nes-container with-title'>
                <p className='title'>txt</p>
                <div id='typewriter'>
                    <p id="markovResults">{currentTxt}</p>
                </div>
            </div>
            <div className='controls'>
                <label>
                    <input id='generateText' type="radio" className="generateText nes-radio" name="botones" />
                    <span onClick={()=> markovIt(currentChain, currentNgram)}>generar texto nuevo</span>
                </label>
                <label>
                    <input id="copyText" type="radio" className="nes-radio" name="botones" defaultChecked />
                    <span onClick={copyText}>copiar texto</span>
                </label>
            </div>
        </div>
    );
}




