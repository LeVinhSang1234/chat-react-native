const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function random(length: number = 16) {
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
let timeout: any = {};
function makeidDebounce(number: number = 16): string {
  const id = random(number);
  if (timeout[id]) {
    return makeidDebounce(number);
  }
  return id;
}

export function debounce(func: Function, duration: number = 0): () => any {
  const id = makeidDebounce(26);
  return () => {
    if (timeout[id]) {
      clearTimeout(timeout[id]);
      delete timeout[id];
    }
    timeout[id] = setTimeout(() => {
      delete timeout[id];
      func();
    }, duration);
  };
}

export function timeoutDebounce(func: any, duration: number) {
  const timeo = setTimeout(func, duration);
  return {
    remove: clearTimeout(timeo),
  };
}
