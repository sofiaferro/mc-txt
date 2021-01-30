import React, { useState } from 'react';
import '../index.css';
import Modal from 'react-modal';

export default function Input({ order, onNext, setCurrentStep, currentStep, currentLines, currentWords, setCurrentTxt, setCurrentChain, setCurrentNgram }) {

    var [currentWish, setCurrentWish] = useState();
    const getWish = () => {
        setCurrentWish(() => {
            return currentWish = document.getElementById('wish').value;
        });
    }

    var [currentFear, setCurrentFear] = useState();
    const getFear = () => {
        setCurrentFear(() => {
            return currentFear = document.getElementById('fear').value;
        });
    }

    var [currentSmell, setCurrentSmell] = useState();
    const getSmell = () => {
        setCurrentSmell(() => {
            return currentSmell = document.getElementById('smell').value;
        });
    }

    var [currentColor, setCurrentColor] = useState();
    const getColor = () => {
        setCurrentColor(() => {
            return currentColor = document.getElementById('color').value;
        });
    }

    var [currentPassion, setCurrentPassion] = useState();
    const getPassion = () => {
        setCurrentPassion(() => {
            return currentPassion = document.getElementById('passion').value;
        });
    }

    function clearInput() {
        var userInput = [...document.getElementsByClassName('input')];
        var isEmpty = userInput.every(item => item.value === '');
        if (isEmpty) {
            setShowModal1(true);
        } else {
            setShowModal2(true);
        }
    };

    function deleteData() {
        var userInput = [...document.getElementsByClassName('input')];
        userInput.forEach((item) => {
            if (item.value) {
                item.value = '';
            };
        });
        setShowModal2(false);
    }

    function generateText() {
        function checkInput() {
            var userInput = [...document.getElementsByClassName('input')];
            for (var i = 0; i < userInput.length; i++) {
                if (!userInput[i].value) {
                    setShowModal3(true);
                    return false;
                }
            }
        }

        function checkContent() {
            var input = [];
            var inputs = document.getElementsByClassName('input');
            for (var i = 0; i < inputs.length; i++) {
                var item = inputs[i].value;
                if (item.endsWith(' ')) {
                    input.push(item.trim());
                } else if (item.includes(' ')) {
                    item = item.split(' ');
                    item.forEach((element) => {
                        input.push(element);
                    });
                } else {
                    input.push(item);
                }
            }
            return input;
        }

        async function getExtracts(input) {
            var extracts = [];

            var url = `https://es.wikipedia.org/api/rest_v1/page/related/${input}`;
            await fetch(url)
                .then(res => res.json())
                .then(data => {
                    for (var i = 0; i < 20; i++) {
                        var item = data.pages[i].extract
                        extracts.push(item);
                    }
                    extracts = extracts.join(' ');
                })
                .catch(err => console.log(err));
                return extracts;

        }

        function generateChain(input) {
            var ngrams = {};
            input = input.toLowerCase();
            var dataSet = input.split(' ');
            for (var i = 0; i <= dataSet.length - order; i++) {
                var gram = dataSet[i];
                if (!ngrams[gram]) {
                    ngrams[gram] = [];
                }
                ngrams[gram].push(dataSet[i + 1]);
            }
            setCurrentChain(dataSet);
            setCurrentNgram(ngrams);
            markovIt(dataSet, ngrams);
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

        async function init() {
            try {
                var isEmpty = checkInput();
                if (isEmpty !== false) {
                    var input = [];
                    input = checkContent();
                    var texto = [];
                    await Promise.all(
                        input.map(async (item) => {
                            var extract = await getExtracts(item);
                            texto.push(extract);
                        }));
                        texto = texto.join(' ');
                        texto = texto.replace(/[\=_!|'“”―«»#%&'‘’‘´*{}–,,..­\/:;?\(\)\[\]@\\$\^*+<>~`\u00a1\u00a7\u00b6\u00b7\u00bf\u037e\u0387\u055a-\u055f\u0589\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0af0\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f14\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u166d\u166e\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u1805\u1807-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cc0-\u1cc7\u1cd3\u2016\u2017\u2020-\u2027\u2030-\u2038\u203b-\u203e\u2041-\u2043\u2047-\u2051\u2053\u2055-\u205e\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00\u2e01\u2e06-\u2e08\u2e0b\u2e0e-\u2e16\u2e18\u2e19\u2e1b\u2e1e\u2e1f\u2e2a-\u2e2e\u2e30-\u2e39\u3001-\u3003\u303d\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uaaf0\uaaf1\uabeb\ufe10-\ufe16\ufe19\ufe30\ufe45\ufe46\ufe49-\ufe4c\ufe50-\ufe52\ufe54-\ufe57\ufe5f-\ufe61\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff07\uff0a\uff0c\uff0e\uff0f\uff1a\uff1b\uff1f\uff20\uff3c\uff61\uff64\uff65]+/g, ''); //eslint-disable-line
                    if (texto.length === 4) {
                        setShowModal4(true);
                        return false
                    } else {
                        generateChain(texto);
                        onNext();
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        init();
    }

    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [showModal3, setShowModal3] = useState(false);
    const [showModal4, setShowModal4] = useState(false);

    return (
        <div id='content' className='content'>
            <h1 className='title' onClick={() => setCurrentStep(0)}>mc-txt</h1>
            <Modal isOpen={showModal1} ariaHideApp={false} className="nes-dialog" >
                <div id="dialog-default">
                    <p className="title">oops...</p>
                    <p>todavía no cargaste ningún dato</p>
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
            <Modal isOpen={showModal3} ariaHideApp={false} className="nes-dialog" >
                <div id="dialog-default">
                    <p className="title">oops...</p>
                    <p>parece que te faltó escribir algo</p>
                    <div className="dialog-menu">
                        <button className="nes-btn is-warning" onClick={() => setShowModal3(false)}>ok</button>
                    </div>
                </div>
            </Modal >
            <Modal isOpen={showModal4} ariaHideApp={false} className="nes-dialog" > 
                <div id="dialog-default">
                        <p className="title">oops...</p>
                        <p>mc-txt no pudo generar texto nuevo</p>
                        <p>intentalo otra vez con inputs nuevos :)</p>
                        <div className="dialog-menu">
                            <button className="nes-btn is-warning" onClick={()=>{
                                setShowModal4(false);
                                setCurrentStep(1);}}>ok</button>
                        </div>
                </div>
                </Modal >
            <div id='contenedor-input' className='div-container nes-container with-title'>
                <p className='title'>input</p>
                <input id='wish' defaultValue={currentWish} onChange={getWish} type='text' className='input nes-input' placeholder='un deseo'></input>
                <input id='fear' defaultValue={currentFear} onChange={getFear} type='text' className='input nes-input' placeholder='un miedo'></input>
                <input id='smell' defaultValue={currentSmell} onChange={getSmell} type='text' className='input nes-input' placeholder='un olor'></input>
                <input id='color' defaultValue={currentColor} onChange={getColor} type='text' className='input nes-input' placeholder='un color'></input>
                <input id='passion' defaultValue={currentPassion} onChange={getPassion} type='text' className='input nes-input' placeholder='una pasión'></input>
            </div>
            <div className='controls'>
                <label>
                    <input id='clearInput' type='radio' className='nes-radio' name='text' />
                    <span className='nes-text' onClick={clearInput}>borrar</span>
                </label>
                <label>
                    <input type='radio' className='nes-radio generateText' name='text' defaultChecked />
                    <span className='nes-text' onClick={() => generateText()}>continuar</span>
                </label>
            </div>
        </div>
    );
}




