import MenuIcon from '@mui/icons-material/Menu';
import { Box, IconButton, Typography } from '@mui/material';
import { LogoShow } from './LogoNListPages';
import { bgColorBanner, colorMainLetter } from '../Constain';

export const SlidebarSubnavbar = ({ handleCloseNavMenu, setActivePage }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      px: 2,
      height: { xs: 56, sm: 64 }, // Chiều cao bằng AppBar chính theo responsive
      backgroundColor: bgColorBanner,
      color: colorMainLetter,
    }}
  >
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      aria-label="open drawer"
      onClick={handleCloseNavMenu}
      sx={{ mr: 2, ml: 0.1 }}
    >
      <MenuIcon />
    </IconButton>

    <LogoShow
      handleCloseNavMenu={handleCloseNavMenu}
      setActivePage={setActivePage}
    />
  </Box>
);
