// Props para que un elemento no-botón (span, h1, ícono) sea operable
// por teclado y lectores de pantalla sin cambiar su apariencia.
export function pressable(onActivate) {
  return {
    role: 'button',
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onActivate();
      }
    },
  };
}
