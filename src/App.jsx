import { useState } from 'react';
import './App.css';
import Modal from 'react-modal';
import Presentation from './components/Presentation';
import Content from './components/Content';
import Input from './components/Input';
import Text from './components/Text';
import Menu from './components/Menu';
import { generatePoem } from './lib/markov';

Modal.setAppElement('#root');

export default function App() {
  const [step, setStep] = useState(0);
  const [words, setWords] = useState('3');
  const [lines, setLines] = useState('10');
  const [model, setModel] = useState(null);
  const [terms, setTerms] = useState([]);
  const [text, setText] = useState('');

  function regenerate(nextModel = model, nextWords = words, nextLines = lines) {
    if (!nextModel) return;
    setText(
      generatePoem(nextModel, {
        wordsPerLine: Number(nextWords),
        lineCount: Number(nextLines),
        anchorTerms: terms,
      })
    );
  }

  return (
    <div className="App" id="App">
      {step === 0 && <Presentation setStep={setStep} />}
      {step === 1 && <Input setStep={setStep} setModel={setModel} setTerms={setTerms} />}
      {step === 2 && (
        <Content
          setStep={setStep}
          words={words}
          lines={lines}
          setWords={setWords}
          setLines={setLines}
          onContinue={(nextWords, nextLines) => {
            regenerate(model, nextWords, nextLines);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <div className="text-screen">
          <Menu step={step} setStep={setStep} bar />
          <Text text={text} setStep={setStep} onRegenerate={() => regenerate()} />
        </div>
      )}
      {step !== 0 && step !== 3 && <Menu step={step} setStep={setStep} />}
    </div>
  );
}
