import { Box, CardContent, CardMedia, Typography } from '@mui/material';
import { Fragment } from 'react';
import {
  colorMainLetter,
  colorSub2Letter,
  colorSub3Letter,
  seeMore,
} from '../Constain';

export const ContentHeader = ({ title, subtitle }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', p: title ? 2 : 0 }}>
    <Box>
      <Typography fontWeight="bold" variant="h5">
        {title}
      </Typography>
      <Typography fontSize={12} color={colorSub2Letter}>
        {subtitle}
      </Typography>
    </Box>
  </Box>
);
export const ContentMain = ({
  title,
  displayText,
  ifSeeMore,
  setExpanded,
  expanded,
}) => (
  <CardContent sx={{ pt: 0 }}>
    <Typography sx={{ whiteSpace: 'pre-line', letterSpacing: 'normal' }}>
      {title}
    </Typography>
    <Typography
      sx={{
        whiteSpace: 'pre-line',
        letterSpacing: 'normal',
        fontSize: !title ? { lg: 'xx-large', xs: 'x-large' } : 'normal',
        textAlign: !title ? 'end' : 'normal',
        fontStyle: !title ? 'italic' : 'normal',
      }}
      onTouchStart={() => expanded && setExpanded(false)}
    >
      {displayText.split('\\n').map((line, i) => (
        <Fragment key={i}>
          {line}
          <br />
        </Fragment>
      ))}{' '}
      {ifSeeMore && (
        <>
          ...{' '}
          <Typography
            component="span"
            onClick={() => setExpanded(true)}
            sx={{
              color: colorSub3Letter,
              cursor: 'pointer',
              fontWeight: 'bold',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {seeMore}
          </Typography>
        </>
      )}
    </Typography>
  </CardContent>
);
export const ContentImg = ({ displayedImages, openViewer, extraCount }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: displayedImages.length === 1 ? '1fr' : '1fr 1fr',
      gap: '4px',
      p: 1,
    }}
  >
    {displayedImages.map((img, index) => (
      <Box
        key={index}
        sx={{
          position: 'relative',
          height: displayedImages.length === 1 ? 300 : 200,
          overflow: 'hidden',
          borderRadius: 2,
          cursor: 'pointer',
        }}
        onClick={() => openViewer(index)}
      >
        <CardMedia
          component="img"
          image={img}
          alt="post image"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {index === 3 && extraCount > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colorMainLetter,
              fontSize: 40,
              fontWeight: 'bold',
              borderRadius: 2,
            }}
          >
            +{extraCount}
          </Box>
        )}
      </Box>
    ))}
  </Box>
);
