import React from 'react';
import { Drawer, Box } from '@mui/material';
import { CategoryMenu } from './SlideBarSubcategories';
import { SlidebarSubnavbar } from './SlideBarSubnavbar';
import { PageMenuItems } from './SlideBarSubpages';
import { bgColorSub2Table, colorMainLetter } from '../Constain';

const getDrawerSize = (
  widthSm = 250,
  heightXs = '100%',
  heightSm = '100%'
) => ({
  width: { xs: '100%', sm: widthSm },
  height: { xs: heightXs, sm: heightSm },
});
const SlideBarMenu = ({
  anchorElNav,
  openCategory,
  setOpenCategory,
  handleCloseNavMenu,
  activePage,
  setActivePage,
  pages,
}) => {
  return (
    <Drawer
      anchor="left"
      open={Boolean(anchorElNav)}
      onClose={handleCloseNavMenu}
      PaperProps={{
        sx: {
          width: getDrawerSize().width,
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: bgColorSub2Table,
          color: colorMainLetter,
          display: 'flex',
          flexDirection: 'column',
          ...getDrawerSize(),
        }}
        role="presentation"
        onKeyDown={handleCloseNavMenu}
      >
        {/* Navbar đầu slidebar */}
        <SlidebarSubnavbar
          handleCloseNavMenu={handleCloseNavMenu}
          setActivePage={setActivePage}
        />
        {/* Nội dung menu scrollable */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {/* Nhóm Pages - chỉ hiển thị xs/md */}
          <PageMenuItems
            handleCloseNavMenu={handleCloseNavMenu}
            activePage={activePage}
            setActivePage={setActivePage}
            pages={pages}
          />
          {/* Nhóm Categories */}
          <CategoryMenu
            openCategory={openCategory}
            setOpenCategory={setOpenCategory}
            handleCloseNavMenu={handleCloseNavMenu}
            activePage={activePage}
            setActivePage={setActivePage}
            pages={pages}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
export default SlideBarMenu;
