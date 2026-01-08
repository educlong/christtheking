import * as React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Menu, MenuItem } from '@mui/material';
import { MenuItemCustome, MenuItemProfile } from './MobileMenuSub';
import { rightsideMenu } from '../Constain';

export default function MobileMenu({
  mobileMoreAnchorEl,
  handleMobileMenuClose,
  handleOpenUserMenu,
}) {
  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(mobileMoreAnchorEl)}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <MenuItemCustome
          custome="show new mails"
          badgeCount={4}
          icon={<MailIcon />}
        />
        <p>{rightsideMenu[0]}</p>
      </MenuItem>

      <MenuItem>
        <MenuItemCustome
          custome="show new notifications"
          badgeCount={17}
          icon={<NotificationsIcon />}
        />
        <p>{rightsideMenu[1]}</p>
      </MenuItem>
      <MenuItemProfile handleOpenUserMenu={handleOpenUserMenu} profile />
    </Menu>
  );
}
