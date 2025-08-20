// tiny fake progress controller used while waiting for backend
// onTick receives progress number 0..100
export function startFakeProgress(onTick) {
  let progress = 0;
  // random-ish step to feel more organic
  const id = setInterval(() => {
    const step = Math.floor(Math.random() * 6) + 1; // 1..6
    progress = Math.min(95, progress + step);
    onTick(progress);
  }, 150);

  return {
    stop(final = 100) {
      clearInterval(id);
      onTick(final);
    },
    cancel() {
      clearInterval(id);
    },
  };
}
