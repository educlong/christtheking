import * as React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import MobileMenu from './navigation/MobileMenu';
import SlideBarMenu from './navigation/SlideBar';
import UserMenu from './navigation/UserMenu';
import SearchBarMoreIcon from './navigation/SearchBarNmoreIcon';
import { MenuItemCustome, MenuItemProfile } from './navigation/MobileMenuSub';
import { AppBar, Box, IconButton, MenuItem, Toolbar } from '@mui/material';
import Header from './navigation/Header';
import { LogoNPages } from './navigation/LogoNListPages';
import { displayFlexmd, typePages } from './Constain';

export default function Navigation({
  activePage,
  setActivePage,
  inits,
  posts,
}) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [openCategory, setOpenCategory] = React.useState(null);
  const pages = JSON.parse(inits.find((item) => item.type === typePages).data);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {/* Left part: Menu Icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2, display: 'flex' }}
            onClick={handleOpenNavMenu}
          >
            <MenuIcon />
          </IconButton>
          {/* Left part: AdbIcon and LOGO & Menu Mobile (list pages)*/}
          <LogoNPages
            handleCloseNavMenu={handleCloseNavMenu}
            activePage={activePage}
            setActivePage={setActivePage}
            pages={pages}
          />
          {/* Search Bar and More Icon for Mobile */}
          <SearchBarMoreIcon handleMobileMenuOpen={handleMobileMenuOpen} />

          {/* Right part: Icons for Mail, Notifications, and User Avatar */}
          <Box sx={{ display: displayFlexmd }}>
            <MenuItem sx={{ m: 0, p: 0 }}>
              <MenuItemCustome
                custome="show 4 new mails"
                badgeCount={4}
                setActivePage={setActivePage}
                icon={<MailIcon />}
              />
            </MenuItem>
            <MenuItem sx={{ m: 0, p: 0 }}>
              <MenuItemCustome
                custome="show 17 new notifications"
                badgeCount={17}
                setActivePage={setActivePage}
                icon={<NotificationsIcon />}
              />
            </MenuItem>
            <MenuItemProfile
              setActivePage={setActivePage}
              handleOpenUserMenu={handleOpenUserMenu}
              profile={false}
            />
          </Box>
        </Toolbar>
        {/* header */}
        <Header inits={inits} posts={posts} />
      </AppBar>
      {/* Mobile Menu */}
      <MobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        handleMobileMenuClose={handleMobileMenuClose}
        handleOpenUserMenu={handleOpenUserMenu}
      />
      {/* User Menu */}
      <UserMenu
        anchorElUser={anchorElUser}
        handleCloseUserMenu={handleCloseUserMenu}
      />
      {/* SlideBar Menu */}
      <SlideBarMenu
        anchorElNav={anchorElNav}
        openCategory={openCategory}
        setOpenCategory={setOpenCategory}
        handleCloseNavMenu={handleCloseNavMenu}
        activePage={activePage}
        setActivePage={setActivePage}
        pages={pages}
      />
    </Box>
  );
}
