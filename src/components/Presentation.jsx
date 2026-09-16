import '../index.css';
import { pressable } from '../lib/a11y';

export default function Presentation({ setStep }) {
  return (
    <div id="content" className="content" style={{ marginTop: '50px' }}>
      <h1 className="nes-text">..........</h1>
      <h1 className="title">mc-txt</h1>
      <div className="toggle-menu">
        <label className="presentation-options">
          <input type="radio" className="nes-radio" name="init" defaultChecked />
          <span className="nes-text" {...pressable(() => setStep(1))}>
            play
          </span>
        </label>
      </div>
      <h1 className="nes-text">..........</h1>
    </div>
  );
}
