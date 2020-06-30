export function sleep(milliseconds: number): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return new Promise(((resolve, _reject): void => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  }))
}
