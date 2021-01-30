import React, { useState } from 'react';
import './App.css';
import Presentation from './components/Presentation'
import Content from './components/Content'
import Input from './components/Input'
import Text from './components/Text'
import Modal from 'react-modal'
import Menu from './components/Menu';

Modal.setAppElement('#root');
export default function App() {
  const [order] = useState(3);

  const [currentStep, setCurrentStep] = useState(0)
  const onNext = () => {
    setCurrentStep(currentStep + 1);
  }

  var [currentWords, setCurrentWords] = useState('3');
  const getWords = () => {
      setCurrentWords(() => {
          return currentWords = document.getElementById('words').value;
      });
  }

  var [currentLines, setCurrentLines] = useState('10');
  const getLines = () => {
      setCurrentLines(() => {
          return currentLines = document.getElementById('lines').value;
      });
  }

  var [currentTxt, setCurrentTxt] = useState();
  const getTxt = () => {
    setCurrentTxt(()=>{
      return currentTxt = document.getElementById('markovResults').innerHTML;
    })
  }

  var [currentChain, setCurrentChain] = useState();
  const getChain = () => {
    setCurrentChain(()=>{
      return currentChain;
    })
  }

  var [currentNgram, setCurrentNgram] = useState();
  const getNgram = () => {
    setCurrentNgram(()=>{
      return currentNgram;
    })
  }


    return (
      <div className='App' id='App'>
        {currentStep === 0 ? <Presentation setCurrentStep={setCurrentStep}/> : ''}
        {currentStep === 1 ? <Input order={order} onNext={onNext} currentStep={currentStep} currentLines={currentLines} currentWords={currentWords} setCurrentTxt={setCurrentTxt} getTxt={getTxt} setCurrentChain={setCurrentChain} setCurrentNgram={setCurrentNgram} setCurrentStep={setCurrentStep}/> : ''}
        {currentStep === 2 ? <Content setCurrentStep={setCurrentStep} currentStep={currentStep} onNext={onNext} getWords={getWords} getLines={getLines} setCurrentWords={setCurrentWords} setCurrentLines={setCurrentLines} currentWords={currentWords} currentLines={currentLines}/> : ''}
        {currentStep === 3 ? <Text order={order} currentLines={currentLines} currentWords={currentWords} currentTxt={currentTxt} setCurrentTxt={setCurrentTxt} getChain={getChain} getNgram={getNgram} currentNgram={currentNgram} currentChain={currentChain} setCurrentStep={setCurrentStep} currentStep={currentStep}/> : ''}
        {currentStep !== 0 ? <Menu currentStep={currentStep} setCurrentStep={setCurrentStep}/> : ''}
      </div>
    );
  }