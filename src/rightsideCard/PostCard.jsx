import { Box, Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ContentHeader, ContentImg, ContentMain } from './ContentPost';
import usePostCardLogic from './PostCardLogic';
import { FullscreenWrapper, ImageFull, ViewerButton } from './ImageCard';
import { useFetchInit } from '../server/InitsHandle';
import { bgColorSub3, colorMainLetter, typeMass } from '../Constain';

export default function PostCard({
  pages,
  title,
  page,
  sub1,
  time,
  location,
  content,
  images = [],
  link_id,
}) {
  const logic = usePostCardLogic({ content, images });
  const {
    viewerRef,
    expanded,
    setExpanded,
    viewerOpen,
    currentIndex,
    setCurrentIndex,
    displayText,
    displayedImages,
    extraCount,
    isLong,
    openViewer,
    closeViewer,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = logic;
  const { init: initMass } = useFetchInit(typeMass);
  const mass = initMass.length > 0 ? JSON.parse(initMass[0].data)[0] : '';
  return (
    <>
      {/* MAIN POST CARD */}
      <Card
        sx={{
          py: { xs: 0, sm: title ? 3 : 0 },
          my: title ? 1.5 : 0,
          width: '100%',
          mt: { xs: title ? 3 : 0, sm: 0 },
          borderRadius: 3,
          boxShadow: title ? '0 1px 5px rgba(0,0,0,0.15)' : 'none',
          backgroundColor: title ? bgColorSub3 : 'transparent',
          color: colorMainLetter,
        }}
      >
        {/* Header */}
        <ContentHeader
          title={title}
          subtitle={
            page !== undefined && pages
              ? `${pages[page].main} / ${
                  pages[page].sub[sub1]
                } - ${time} - Location: ${
                  mass &&
                  (location === -1 ? 'All' : mass.content[location].church)
                }`
              : ''
          }
        />
        {/* Content */}
        <ContentMain
          title={title}
          displayText={displayText}
          ifSeeMore={isLong && !expanded}
          setExpanded={setExpanded}
          expanded={expanded}
        />
        {/* Images */}
        {images.length > 0 && (
          <ContentImg
            displayedImages={displayedImages}
            openViewer={openViewer}
            extraCount={extraCount}
          />
        )}
        {link_id && (
          <Box
            sx={{
              position: 'relative',
              paddingTop: '56.25%', // 16:9
              width: '100%',
            }}
          >
            <Box
              component="iframe"
              src={`https://www.youtube.com/embed/${link_id}`}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
        )}
      </Card>

      {/* =========================== */}
      {/* FULLSCREEN IMAGE VIEWER     */}
      {/* =========================== */}
      {viewerOpen && (
        <FullscreenWrapper
          viewerRef={viewerRef}
          closeViewer={closeViewer}
          currentIndex={currentIndex}
          images={images}
          setCurrentIndex={setCurrentIndex}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
        >
          {/* Nút Close */}
          <ViewerButton
            condition={true}
            onClick={closeViewer}
            sx={{ top: 20, left: 20 }}
          >
            <CloseIcon sx={{ fontSize: 35 }} />
          </ViewerButton>

          {/* Nút Previous */}
          <ViewerButton
            condition={currentIndex > 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            sx={{
              left: 20,
              // width: '20%', height: '50%'
            }}
          >
            <ArrowBackIosNewIcon sx={{ fontSize: 40 }} />
          </ViewerButton>

          {/* Nút Next */}
          <ViewerButton
            condition={currentIndex < images.length - 1}
            onClick={() => setCurrentIndex(currentIndex + 1)}
            sx={{ right: 20 }}
          >
            <ArrowForwardIosIcon sx={{ fontSize: 40 }} />
          </ViewerButton>

          {/* Ảnh */}
          <ImageFull
            src={images[currentIndex]}
            onClick={(e) => e.stopPropagation()}
          />
        </FullscreenWrapper>
      )}
    </>
  );
}
