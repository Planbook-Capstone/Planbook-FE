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
      // responsive: true,
    });

    wavesurfer.current.load(item?.url);

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [item?.url]);

  const togglePlay = () => {
    if (!wavesurfer.current) return;

    wavesurfer.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <div ref={waveformRef} />
      <button
        onClick={togglePlay}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
}

export default AudioPreview;
