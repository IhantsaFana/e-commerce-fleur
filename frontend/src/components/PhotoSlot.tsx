interface PhotoSlotProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function PhotoSlot({ src, alt = "", className = "" }: PhotoSlotProps) {
  return (
    <div className={`ph-img ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}
