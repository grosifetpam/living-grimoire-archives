import { useState, ImgHTMLAttributes } from "react";

const FALLBACK_DARK = "/placeholder.svg";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackIcon?: string;
  fallbackClassName?: string;
}

const ImageWithFallback = ({
  src,
  alt,
  fallbackIcon,
  fallbackClassName,
  className,
  ...props
}: ImageWithFallbackProps) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    if (fallbackIcon) {
      return (
        <div className={`flex items-center justify-center ${fallbackClassName || className || ""}`}>
          <span className="text-2xl">{fallbackIcon}</span>
        </div>
      );
    }
    return (
      <img
        src={FALLBACK_DARK}
        alt={alt || "Image"}
        className={`${className || ""} opacity-30`}
        {...props}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
