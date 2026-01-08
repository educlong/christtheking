import { Box, Toolbar, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { Renewal } from './HeaderSub2';
import {
  bgColorLanguage,
  bgColorSub2Table,
  bgColorSub4,
  bgColorSub6,
  colorSub10Letter,
  colorSubLanguage,
  logo_holyyear,
  now,
  NumberScrollToDisappearHeader,
  typeAnnouncement,
} from '../Constain';
import { ChurchMarquee } from './HeaderSub1';
import { useFetchImages } from '../server/ImgsHandle';

const toolbarStyles = (displayHeader, mH, colorTop, colorBottom) => ({
  m: 0,
  p: 0,
  backgroundColor: bgColorSub6,
  transition: 'opacity 0.3s ease',
  display:
    displayHeader === undefined
      ? 'flex'
      : displayHeader > NumberScrollToDisappearHeader
      ? 'none'
      : 'flex',
  minHeight: `${mH}px !important`, // Khớp chiều cao chuẩn MUI
  background: `linear-gradient(to bottom, ${colorTop} 0%, ${colorBottom} 100%)`,
});
const boxStyle = (pos, w, h, sb) => ({
  width: w,
  height: h, // ⭐ Lấy đúng chiều cao của Toolbar
  display: 'flex',
  alignItems: 'center',
  padding: '0',
  position: pos,
  justifyContent: sb,
});
export default function Header({ inits, posts }) {
  const { images } = useFetchImages(logo_holyyear);
  const [displayHeader, setDisplayHeader] = useState(1);
  useEffect(() => {
    const handleScroll = () => {
      setDisplayHeader(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const announcement = JSON.parse(
    inits.find((item) => item.type === typeAnnouncement).data
  );
  return (
    <>
      {/* Header 1 (dưới Navigation) */}
      <Toolbar
        sx={toolbarStyles(displayHeader, 64, bgColorSub4, bgColorSub2Table)}
      >
        <Box sx={boxStyle('relative', '100%', '100%', 'center')}>
          {images.length > 0 ? (
            <Box
              component="img"
              src={images[0].base64}
              alt="Logo"
              sx={{
                width: 'auto',
                height: 64, // ⭐ Scale theo chiều cao toolbar
                mx: 2,
                display: 'flex',
              }}
            />
          ) : (
            <p></p>
          )}
          <ChurchMarquee inits={inits} />
        </Box>
      </Toolbar>
      {/* Header 2 (dưới header 1) */}
      <Toolbar
        sx={toolbarStyles(
          undefined,
          38,
          displayHeader <= NumberScrollToDisappearHeader
            ? bgColorSub2Table
            : bgColorSub4,
          bgColorSub2Table
        )}
      >
        <Box sx={[boxStyle('fixed', '96%', 'auto', 'space-between')]}>
          <Renewal inits={inits} posts={posts} />
        </Box>
      </Toolbar>
      {/* Header 3 (nếu có thông báo quan trọng thì hiển thị header này) */}
      {announcement &&
      announcement.message &&
      announcement.message.trim() !== '' &&
      new Date(announcement.expiryDate) >= now ? (
        <Toolbar
          sx={{
            ...toolbarStyles(undefined, 38, bgColorLanguage, bgColorLanguage),
            color: colorSubLanguage,
          }}
        >
          <Typography component="span" sx={{ my: 1, fontWeight: 'bold' }}>
            <span
              style={{ color: colorSub10Letter }}
            >{`${announcement.title}: `}</span>
            {announcement.message}
          </Typography>
        </Toolbar>
      ) : (
        <></>
      )}
    </>
  );
}
