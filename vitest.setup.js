import '@testing-library/jest-dom/vitest';

// react-modal exige un #root al importarse App (Modal.setAppElement).
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
