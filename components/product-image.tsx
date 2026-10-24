"use client";
import { useEffect, useState } from "react";
import { categoryImage } from "@/lib/utils";

// Mahsulot rasmi. Havola ishlamasa, kategoriya rasmi ko'rsatiladi.
// referrerPolicy="no-referrer" — ko'p saytlar (Google, Pinterest va h.k.) rasmni boshqa saytga bermasligini chetlab o'tadi.
interface ProductImageProps {
  src?: string;
  category?: string;
  alt?: string;
  className?: string;
}

export default function ProductImage({ src, category, alt = "", className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  const url = !src || failed ? categoryImage(category) : src;
  return (
    <img
      src={url}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

// Formada kiritilgan havolani darrov ko'rsatadi va xatoni aytadi
export function ImagePreview({ src }: { src?: string }) {
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  useEffect(() => setState("loading"), [src]);
  if (!src) return null;
  if (state === "error")
    return (
      <p className="text-xs text-destructive">
        Rasm yuklanmadi. Rasmning o'ziga olib boradigan havola kiriting (.jpg, .png, .webp bilan tugaydigan).
      </p>
    );
  return (
    <img
      src={src}
      alt="Ko'rinish"
      referrerPolicy="no-referrer"
      className="h-32 w-full rounded-lg border object-cover"
      onLoad={() => setState("ok")}
      onError={() => setState("error")}
    />
  );
}
