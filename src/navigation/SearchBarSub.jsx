import { alpha, InputBase, styled } from '@mui/material';

export const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px', // Bo tròn 16px cho các góc
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  [theme.breakpoints.down('sm')]: {
    width: '60%', // Thu nhỏ thanh tìm kiếm xuống 60% khi màn hình nhỏ
    marginLeft: 'auto', // Căn phải khi responsive
    padding: 0, // Bỏ padding khi responsive
    margin: 0, // Bỏ margin khi responsive
  },
  [theme.breakpoints.up('lg')]: {
    width: '100%', // Đảm bảo thanh tìm kiếm tràn ra từ chữ "BLOG" đến biểu tượng "Messages" ở màn hình lớn trở lên
    marginLeft: theme.spacing(2),
  },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%', // Khi màn hình nhỏ thì chiếm toàn bộ chiều rộng
    },
    [theme.breakpoints.up('lg')]: {
      width: '100%', // Đảm bảo thanh tìm kiếm tràn ra từ chữ "BLOG" đến biểu tượng "Messages" ở màn hình lớn trở lên
      marginLeft: theme.spacing(2),
    },
  },
}));
