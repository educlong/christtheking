import { Box, IconButton } from '@mui/material';
import { colorMainLetter } from '../Constain';

export const FullscreenWrapper = ({
  children,
  viewerRef,
  closeViewer,
  currentIndex,
  images,
  setCurrentIndex,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
}) => (
  <Box
    ref={viewerRef}
    onClick={(e) => {
      if (e.target === e.currentTarget) closeViewer();
    }}
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
        setCurrentIndex((idx) => idx + 1);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex((idx) => idx - 1);
      }
      if (e.key === 'Escape') closeViewer();
    }}
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      bgcolor: 'rgba(0,0,0,0.92)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      touchAction: 'none',
    }}
    autoFocus
    onTouchStart={handleTouchStart}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
  >
    {children}
  </Box>
);

export const ImageFull = ({ src, onClick }) => (
  <Box
    component="img"
    src={src}
    alt="fullscreen"
    onClick={onClick}
    sx={{
      maxWidth: '90%',
      maxHeight: '90%',
      objectFit: 'contain',
      borderRadius: 2,
      cursor: 'pointer',
    }}
  />
);
export const ViewerButton = ({ condition, onClick, children, sx }) =>
  !condition ? null : (
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      sx={{
        position: 'absolute',
        // outline: 'none !important',
        // '&:focus': {
        //   outline: 'none !important',
        // },
        // '&:focus-visible': {
        //   outline: 'none !important',
        // },
        // WebkitTapHighlightColor: 'transparent', // tránh vòng tròn highlight
        color: colorMainLetter,
        ...sx,
      }}
    >
      {children}
    </IconButton>
  );
