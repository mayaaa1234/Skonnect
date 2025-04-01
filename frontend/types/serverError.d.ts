declare global {
  interface ServerError {
    msg?: string;
    errs?: string;
  }
}

export {};
