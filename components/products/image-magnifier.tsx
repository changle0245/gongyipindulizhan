'use client';

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageMagnifierProps {
  src: string;
  alt: string;
  magnifierHeight?: number;
  magnifierWidth?: number;
  zoomLevel?: number;
  className?: string;
}

/**
 * 图片放大镜组件
 * 鼠标悬停时显示放大的局部区域
 */
export function ImageMagnifier({
  src,
  alt,
  magnifierHeight = 200,
  magnifierWidth = 200,
  zoomLevel = 2.5,
  className
}: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    // 计算鼠标在图片中的位置
    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        width={800}
        height={800}
        className="w-full h-auto object-contain"
        priority
      />

      {/* 放大镜 */}
      <div
        style={{
          display: showMagnifier ? '' : 'none',
          position: 'absolute',
          pointerEvents: 'none',
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          top: `${y - magnifierHeight / 2}px`,
          left: `${x - magnifierWidth / 2}px`,
          opacity: '1',
          border: '2px solid #d1d5db',
          backgroundColor: 'white',
          backgroundImage: `url('${src}')`,
          backgroundRepeat: 'no-repeat',
          borderRadius: '50%',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',

          // 计算背景位置以显示放大的区域
          backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
          backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
          backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
        }}
      />
    </div>
  );
}
