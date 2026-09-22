import { useRef, useCallback } from "react";

function useSound(src: string, volume: number): () => void {
  const ctxRef = useRef<AudioContext | null>(null);
  const bufferPromiseRef = useRef<Promise<AudioBuffer> | null>(null);

  const play = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    if (!bufferPromiseRef.current) {
      bufferPromiseRef.current = fetch(src)
        .then((res) => res.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf));
    }

    bufferPromiseRef.current
      .then((buffer) => {
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = ctx.createGain();
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
      })
      .catch((err) => console.error("Decoding audio error:", err));
  }, [src, volume]);

  return play;
}

export default useSound;
