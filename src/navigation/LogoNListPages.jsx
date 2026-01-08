import { Box, Button, Typography } from '@mui/material';
import {
  checkUrl,
  colorMainLetter,
  colorSub5Letter,
  displayFlexsm,
  Homepage,
  logo_parish,
  sizePic,
} from '../Constain';
import {
  NavLink,
  useLocation,
} from 'react-router-dom'; /**Import NavLink để đổi tất cả các thẻ a thành NavLink (để thực hiện link trong single wep app) */
import { useFetchImages } from '../server/ImgsHandle';

export const LogoShow = ({ handleCloseNavMenu, setActivePage }) => {
  const { images } = useFetchImages(logo_parish);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {images.length > 0 ? (
        <Box
          component="img"
          src={images[0].base64}
          alt="Logo Picture"
          sx={{ width: sizePic[0], height: sizePic[1], color: colorMainLetter }}
        />
      ) : (
        <p></p>
      )}
      <Typography
        variant="h6"
        noWrap
        component={NavLink}
        to={`/${Homepage}`}
        sx={{
          mr: 2,
          display: 'flex',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.15rem',
          color: 'inherit',
          textDecoration: 'none',
          width: '100px',
          '&:hover': { color: colorSub5Letter },
        }}
        onClick={() => (handleCloseNavMenu(), setActivePage(Homepage))}
      >
        {Homepage}
      </Typography>
    </Box>
  );
};
export const LogoNPages = ({
  handleCloseNavMenu,
  activePage,
  setActivePage,
  pages,
}) => {
  const location = useLocation();
  return (
    <>
      <Box
        sx={{
          display: displayFlexsm,
          alignItems: 'center',
          width: 'min-content',
        }}
      >
        <LogoShow
          handleCloseNavMenu={handleCloseNavMenu}
          setActivePage={setActivePage}
        />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: { xs: 'none', md: 'inline-flex' }, // Thay 'flex' bằng 'inline-flex' để không chiếm hết chiều rộng
          alignItems: 'center', // Đảm bảo các phần tử được căn giữa
        }}
      >
        {pages &&
          pages.map((page) => (
            <Button
              key={page.main}
              component={NavLink}
              to={`/${page.main}`}
              onClick={() => (handleCloseNavMenu(), setActivePage(page.main))}
              sx={{
                color: checkUrl(activePage, page.main, location)
                  ? colorSub5Letter
                  : colorMainLetter,
                fontWeight: 'bold', // ⭐ chữ in đậm
                transition: 'opacity 0.2s ease',
                marginRight: 0.5, // Thêm khoảng cách giữa các Button nếu cần
                textDecoration: checkUrl(activePage, page.main, location)
                  ? 'underline'
                  : 'none',
                textUnderlineOffset: '4px',
                '&:hover': {
                  opacity: 0.6, // ⭐ hover làm chữ mờ
                  backgroundColor: 'transparent', // ⭐ bỏ background hover mặc định của MUI
                  color: colorMainLetter,
                },
              }}
            >
              {page.main}
            </Button>
          ))}
      </Box>
    </>
  );
};
