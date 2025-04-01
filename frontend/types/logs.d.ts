declare global {
  const log: typeof console.log;
  const err: typeof console.error;
  // const warn: typeof console.log;
}

globalThis.log = console.log;
globalThis.err = console.error;

export {};
