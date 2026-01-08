import { Box, MenuItem, Typography } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { checkUrl, colorMainLetter, colorSub5Letter } from '../Constain';

export const CategoryMenu = ({
  openCategory,
  setOpenCategory,
  handleCloseNavMenu,
  activePage,
  setActivePage,
  pages,
}) => {
  const location = useLocation();
  return (
    <Box>
      {pages &&
        pages.map((page, idx) => (
          <Box key={idx}>
            <MenuItem
              onClick={() =>
                page.sub?.length
                  ? setOpenCategory(
                      openCategory === page.main ? null : page.main
                    )
                  : null
              }
              sx={{
                borderTop: idx === 0 ? '1px solid rgba(0,0,0,0.12)' : 'none',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: checkUrl(activePage, page.main, location)
                  ? colorSub5Letter
                  : colorMainLetter,
              }}
            >
              <Typography>{page.main}</Typography>
              {page.sub?.length > 0 && (
                <Typography sx={{ fontSize: '18px' }}>
                  {openCategory === page.main ? '▾' : '▸'}
                </Typography>
              )}
            </MenuItem>
            {openCategory === page.main &&
              page.sub.map((item, index) => (
                <MenuItem
                  component={NavLink}
                  key={index}
                  to={`/${page.main}/${page.main}${index}`}
                  onClick={() => (
                    handleCloseNavMenu(),
                    setActivePage(`${page.main}/${page.main}${index}`)
                  )}
                  sx={{
                    pl: 4,
                    color: checkUrl(
                      activePage,
                      `${page.main}/${page.main}${index}`,
                      location
                    )
                      ? colorSub5Letter
                      : colorMainLetter,
                    '&:hover': {
                      opacity: 0.6, // ⭐ hover làm chữ mờ
                      backgroundColor: 'transparent', // ⭐ bỏ background hover mặc định của MUI
                      color: colorMainLetter,
                    },
                  }}
                >
                  <Typography>{item}</Typography>
                </MenuItem>
              ))}
          </Box>
        ))}
    </Box>
  );
};
