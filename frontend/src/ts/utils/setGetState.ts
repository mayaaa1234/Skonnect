export function setState<T>(name: string, state: T): void {
  localStorage.setItem(name, JSON.stringify(state));
}

export function getState<T>(name: string): T | null {
  const item = localStorage.getItem(name);
  return item ? (JSON.parse(item) as T) : null;
}
