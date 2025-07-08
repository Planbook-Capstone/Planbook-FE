interface Props {
  item: any;
}

function MediaPreview({ item }: Props) {
  return (
    <div className="space-y-1">
      <div className="font-calsans">{item.name}</div>
      <div className="relative w-full aspect-video overflow-hidden rounded shadow">
        <video
          controls
          className="absolute top-0 left-0 w-full h-full object-cover"
          preload="metadata"
        >
          <source src={item.url} type="video/mp4" />
          {/* Trình duyệt không hỗ trợ video. */}
        </video>
      </div>
    </div>
  );
}

export default MediaPreview;
