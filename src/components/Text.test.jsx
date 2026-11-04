import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Text from './Text';

describe('Text', () => {
  it('la flecha vuelve a la estructura', () => {
    const setStep = vi.fn();
    render(<Text text={'uno dos\ntres cuatro.'} setStep={setStep} onRegenerate={() => {}} />);
    fireEvent.click(screen.getByLabelText('volver a la estructura'));
    expect(setStep).toHaveBeenCalledWith(2);
  });
});
