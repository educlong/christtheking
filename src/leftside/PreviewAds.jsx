import { Box } from '@mui/material';
import { useState } from 'react';

export const useImagePreview = ({ preview_size, margin, addOffsetY }) => {
  const [preview, setPreview] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const mouseY = e.clientY;
    const viewportHeight = window.innerHeight;
    const zoneHeight = viewportHeight / 3;

    let offsetY;

    if (mouseY < zoneHeight) {
      offsetY = margin; // 1/3 trên → ảnh dưới
    } else if (mouseY < zoneHeight * 2) {
      offsetY = -(preview_size / 2); // 1/3 giữa → căn giữa
    } else {
      offsetY = -(preview_size + margin) + addOffsetY; // 1/3 dưới → ảnh phía trên
    }

    const offsetX = 20;

    setPos({
      x: e.clientX + offsetX,
      y: e.clientY + offsetY,
    });
  };

  const handleEnter = (img) => {
    setPreview(img);
  };

  const handleLeave = () => {
    setPreview(null);
  };

  return {
    preview,
    pos,
    handleMove,
    handleEnter,
    handleLeave,
  };
};
