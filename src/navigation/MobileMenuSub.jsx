import { NavLink } from 'react-router-dom';
import { Badge, IconButton, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { colorSub8Letter, rightsideMenu } from '../Constain';

export const MenuItemCustome = ({
  custome,
  badgeCount,
  setActivePage,
  icon,
}) => (
  <IconButton
    size="large"
    aria-label={custome}
    color="inherit"
    component={NavLink}
    to={custome}
    onClick={() => setActivePage(custome)}
    sx={{
      '&:hover': {
        color: colorSub8Letter, // màu bạn muốn
      },
    }}
  >
    <Badge badgeContent={badgeCount} color="error">
      {icon}
    </Badge>
  </IconButton>
);
export const MenuItemProfile = ({
  // setActivePage,
  handleOpenUserMenu,
  profile,
}) => (
  <MenuItem onClick={handleOpenUserMenu} sx={!profile ? { m: 0, p: 0 } : {}}>
    <IconButton
      size="large"
      aria-label="account of current user"
      color="inherit"
    >
      <AccountCircle />
    </IconButton>
    {profile ? <p>{rightsideMenu[rightsideMenu.length - 1]}</p> : null}
  </MenuItem>
);
