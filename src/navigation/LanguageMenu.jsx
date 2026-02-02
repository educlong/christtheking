import { Box, Menu, MenuItem, Typography } from '@mui/material';
import {
  bgColorLanguage,
  colorSub9Letter,
  colorSubLanguage,
  displayxs,
  getMenuPaperProps,
  typeAds_info,
  typeLanguages,
} from '../Constain';
import LanguageIcon from '@mui/icons-material/Language';
import { MenuItemCustome } from './MobileMenuSub';

export function LanguageButton({
  inits,
  anchorElLang,
  handleCloseLangMenu,
  handleOpenLangMenu,
}) {
  const adsContact = JSON.parse(
    inits.find((item) => item.type === typeAds_info).data
  );
  const languages = inits.find((item) => item.type === typeLanguages);
  const capitalize = (s) =>
    s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 8,
          left: 16,
          zIndex: 1300, // đảm bảo nổi trên các phần tử khác
          // backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1, // khoảng cách giữa chữ và nút
        }}
      >
        {/* 🔹 Nút Language */}
        {/* <MenuItem
          sx={{ m: 0, p: 0, color: colorSub9Letter }}
          onClick={handleOpenLangMenu}
        >
          <MenuItemCustome
            custome={capitalize(languages.type)}
            icon={<LanguageIcon />}
          />
        </MenuItem> */}
        {/* 🔹 Khối quảng cáo */}
        <Box
          sx={{
            backgroundColor: bgColorLanguage,
            color: colorSubLanguage,
            px: 1.5,
            py: 0.7,
            borderRadius: 1,
            fontSize: { xs: 11, sm: 12 },
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            lineHeight: 1.2,
          }}
        >
          {adsContact && <strong>{`${adsContact.title} `}</strong>}
          <span>- </span>
          <Box component="br" sx={{ display: displayxs }} />
          {`${adsContact && adsContact.mr}: `}
          {adsContact && (
            <span style={{ fontWeight: 600 }}>{adsContact.email}</span>
          )}
        </Box>
      </Box>
      <LanguageMenu
        languages={JSON.parse(languages.data)}
        anchorElLang={Boolean(anchorElLang)}
        handleCloseLangMenu={handleCloseLangMenu}
      />
    </>
  );
}

// language selection menu component, khi nhấn vào nut ngôn ngữ sẽ hiện menu này
export function LanguageMenu({ languages, anchorElLang, handleCloseLangMenu }) {
  return (
    <Menu
      anchorEl={anchorElLang}
      open={Boolean(anchorElLang)}
      onClose={handleCloseLangMenu}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      PaperProps={{
        ...getMenuPaperProps(100), // giữ nguyên tất cả trong getMenuPaperProps
        sx: {
          ...getMenuPaperProps(100).sx, // giữ nguyên css cũ
          mt: -1, // thêm offset
          ml: 6, // thêm offset
        },
      }}
    >
      {languages &&
        languages.map((lang) => (
          <MenuItem key={lang} onClick={handleCloseLangMenu}>
            <Typography sx={{ fontSize: 'x-small' }}>{lang}</Typography>
          </MenuItem>
        ))}
    </Menu>
  );
}
