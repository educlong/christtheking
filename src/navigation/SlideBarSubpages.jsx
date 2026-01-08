import { Box, MenuItem, Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import {
  checkUrl,
  colorMainLetter,
  colorSub5Letter,
  displayxssm,
} from '../Constain';

export const PageMenuItems = ({
  handleCloseNavMenu,
  activePage,
  setActivePage,
  pages,
}) => {
  const location = useLocation();
  return (
    <Box sx={{ display: displayxssm }}>
      {pages &&
        pages.map((page, idx) => (
          <MenuItem
            component={NavLink}
            key={idx}
            to={`/${page.main}`}
            onClick={() => (handleCloseNavMenu(), setActivePage(page.main))}
            sx={{
              borderBottom:
                idx === pages.length - 1 ? '1px solid black' : 'none',
              color: checkUrl(activePage, page.main, location)
                ? colorSub5Letter
                : colorMainLetter,
              '&:hover': {
                opacity: 0.6, // ⭐ hover làm chữ mờ
                backgroundColor: 'transparent', // ⭐ bỏ background hover mặc định của MUI
                color: colorMainLetter,
              },
            }}
          >
            <Typography>{page.main}</Typography>
          </MenuItem>
        ))}
    </Box>
  );
};

// activePage, page, location
