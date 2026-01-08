import { Box, IconButton, MenuItem } from '@mui/material';
import MoreIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Search, SearchIconWrapper, StyledInputBase } from './SearchBarSub';
import { displayFlexxs } from '../Constain';

const SearchBar = () => (
  <Search sx={{ mr: 0.5, flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    <StyledInputBase
      placeholder="Search…"
      inputProps={{ 'aria-label': 'search' }}
      sx={{ flexGrow: 1 }} // Thêm flexGrow để tràn ra
    />
  </Search>
);
const SearchBarMoreIcon = ({ handleMobileMenuOpen }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end', // Đặt các phần tử từ trái sang phải
      alignItems: 'center',
      width: '100%', // Đảm bảo box chiếm hết chiều rộng
      ml: 'auto',
    }}
  >
    {/* Search Bar */}
    <SearchBar />
    {/* More Icon (only on small screens) */}
    <IconButton
      size="large"
      aria-label="show more"
      aria-controls="mobile-menu"
      aria-haspopup="true"
      onClick={handleMobileMenuOpen}
      color="inherit"
      sx={{ display: displayFlexxs }}
    >
      <MoreIcon />
    </IconButton>
  </Box>
);

export default SearchBarMoreIcon;
