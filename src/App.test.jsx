import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('muestra la pantalla de presentación', () => {
    render(<App />);
    expect(screen.getByText('mc-txt')).toBeInTheDocument();
    expect(screen.getByText('play')).toBeInTheDocument();
  });

  it('"play" avanza a la pantalla de inputs', () => {
    render(<App />);
    fireEvent.click(screen.getByText('play'));
    expect(screen.getByPlaceholderText('un deseo')).toBeInTheDocument();
    expect(screen.getByText('continuar')).toBeInTheDocument();
  });
});
