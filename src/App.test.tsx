import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { STORAGE_KEY } from './domain/storage';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  localStorage.clear();
});

describe('App', () => {
  it('merender shell tanpa crash saat storage kosong', () => {
    act(() => root.render(<App />));

    expect(container.textContent).toContain('Autonomus');
    expect(container.textContent).toContain('Fondasi data');
    expect(container.textContent).toContain('Belum ada data');
  });

  it('menampilkan peringatan saat data lokal rusak', () => {
    localStorage.setItem(STORAGE_KEY, '{rusak');

    act(() => root.render(<App />));

    expect(container.textContent).toContain('Data lokal tidak dapat dibaca');
    expect(container.textContent).toContain('Data dipulihkan');
  });
});
