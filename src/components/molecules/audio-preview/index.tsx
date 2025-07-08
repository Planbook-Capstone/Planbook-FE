import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface Props {
  item: any;
}

function AudioPreview({ item }: Props) {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#007bff",
      height: 60,
    });

    wavesurfer.current.load(item?.url);

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    // ✅ Gắn sự kiện click để toggle play/pause
    const waveformEl = waveformRef.current;
    const handleClick = () => {
      if (wavesurfer.current) {
        wavesurfer.current.playPause();
        setIsPlaying((prev) => !prev);
      }
    };
    waveformEl.addEventListener("click", handleClick);

    return () => {
      wavesurfer.current?.destroy();
      waveformEl.removeEventListener("click", handleClick);
    };
  }, [item?.url]);

  return (
    <div className="cursor-pointer">
      <div>
        <p>{item?.name}</p>
      </div>
      <div ref={waveformRef} />
    </div>
  );
}

export default AudioPreview;
