import { Box } from '@mui/material';
import { useImagePreview } from './PreviewAds';
import { colorMainLetter, typeRenew, displaylg } from '../Constain';

export default function Ads({ images = [], inits }) {
  const renew = JSON.parse(inits.find((item) => item.type === typeRenew).data);
  const PREVIEW_SIZE = 500;
  const { preview, pos, handleMove, handleEnter, handleLeave } =
    useImagePreview({
      preview_size: PREVIEW_SIZE,
      margin: 20,
      addOffsetY: 150,
    });
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr' },
        gap: 2,
      }}
    >
      {images.length > 0 &&
        images.map((img, i) => (
          <Box
            key={i}
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              bgcolor: colorMainLetter,
              cursor: 'pointer', // ⭐ con trỏ chuột thành ngón tay
            }}
            onMouseEnter={() => handleEnter(img.base64)}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            onClick={() => {
              if (i === 0 && renew)
                window.open(renew[0].web, '_blank', 'noopener,noreferrer');
            }}
          >
            <Box
              component="img"
              src={img.base64}
              alt={`ads-${i}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        ))}

      {/* ⭐ Ảnh phóng to */}
      {preview && (
        <BigPic
          pos={pos}
          preview_width={PREVIEW_SIZE}
          preview_height={PREVIEW_SIZE}
          preview={preview}
          display={displaylg}
        />
      )}
    </Box>
  );
}

export const BigPic = ({
  pos,
  preview_width,
  preview_height,
  preview,
  display,
}) => (
  <Box
    sx={{
      position: 'fixed',
      top: pos.y,
      left: pos.x,
      width: 'auto',
      height: 'auto',
      maxWidth: preview_width,
      maxHeight: preview_height,
      objectFit: 'contain',
      pointerEvents: 'none',
      borderRadius: 2,
      zIndex: 9999,
      boxShadow: '0 4px 25px rgba(0,0,0,0.35)',
      transition: 'opacity 0.05s linear',
      display: display,
    }}
    component="img"
    src={preview}
  />
);
