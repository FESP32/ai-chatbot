'use client';

import Image from 'next/image';
import { useState } from 'react';
import { HexagonIcon } from 'lucide-react';

export default function SafeImage({
  src,
  alt,
  width,
  height,
}: { src: string; alt?: string; width: number; height: number }) {
  const [error, setError] = useState(false);

  return (
    <div className="relative" style={{ width, height }}>
      {!error ? (
        <Image
          src={src}
          alt={alt || ''}
          width={width}
          height={height}
          onError={() => setError(true)}
          className="object-cover rounded-full"
        />
      ) : (
        <div className="flex items-center justify-center size-full rounded-full">
          <HexagonIcon />
        </div>
      )}
    </div>
  );
}
