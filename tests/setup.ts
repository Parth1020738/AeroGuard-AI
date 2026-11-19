import '@testing-library/jest-dom';

// Polyfill localStorage for node 22+ jsdom environment if missing
if (typeof window !== 'undefined') {
  const store = new Map<string, string>();
  const localStorageMock: Storage = {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      store.set(key, String(value));
    },
    removeItem: (key: string): void => {
      store.delete(key);
    },
    clear: (): void => {
      store.clear();
    },
    key: (index: number): string | null => Array.from(store.keys())[index] ?? null,
    get length(): number {
      return store.size;
    },
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
}
