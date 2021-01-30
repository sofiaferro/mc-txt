import React from 'react';
import '../index.css';

export default function Presentation({ setCurrentStep }) {

    return (
        <div id='content' className='content' style={{marginTop: '50px'}}>
            <h1 className="nes-text">..........</h1>
            <h1 className='title'>mc-txt</h1>
            <div className='toggle-menu'>
                <label className='presentation-options'>
                    <input type='radio' className='nes-radio' name='init' defaultChecked />
                    <span className='nes-text' onClick={() => setCurrentStep(1)} >play</span>
                </label>
            </div>
            <h1 className="nes-text">..........</h1>
        </div>
    );
}