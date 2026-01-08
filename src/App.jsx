import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from './Navigation';
import { LanguageButton } from './navigation/LanguageMenu';
import Mainroot from './Mainroot';
import { Box } from '@mui/material';
import AnouncementAds from './leftside/anouncementAds';
import { useFetchInit, useFetchInits } from './server/InitsHandle';
import { useFetchPosts } from './server/PostsHandle';
import {
  colorMainLetter,
  pics_ads,
  saveAuth,
  typeAnnouncement,
  typeAuth,
} from './Constain';
import { useFetchImages } from './server/ImgsHandle';
import Loading from './Loading';

function App() {
  const [anchorElLang, setAnchorElLang] = useState(null);
  const handleOpenLangMenu = (event) => {
    setAnchorElLang(event.currentTarget);
  };
  const handleCloseLangMenu = () => {
    setAnchorElLang(null);
  };
  const [activePage, setActivePage] = useState(''); //page nào đc chọn, url của page
  const { inits } = useFetchInits();
  const { images } = useFetchImages(pics_ads);
  const { init: authUsersInit } = useFetchInit(typeAuth);
  const authUsers =
    authUsersInit && authUsersInit.length > 0
      ? JSON.parse(authUsersInit[0].data)
      : '';
  const isAdmin =
    authUsers &&
    authUsers.length > 0 &&
    (() => {
      try {
        const raw = localStorage.getItem(saveAuth);
        if (!raw) return false;
        const auth = JSON.parse(raw);
        return auth?.auth === authUsers[0].auth;
      } catch {
        return false;
      }
    })();
  const { posts } = useFetchPosts(isAdmin);
  const announcement =
    inits.length > 0 &&
    JSON.parse(inits.find((item) => item.type === typeAnnouncement).data);
  const _inits = inits.length > 0 ? JSON.parse(inits[0].data) : '';
  // inits && inits.length > 0 && console.log(inits, images, posts);
  // ===== điều kiện loading =====
  const isLoading =
    !inits ||
    inits.length === 0 ||
    !images ||
    images.length === 0 ||
    !posts ||
    posts.length === 0;
  if (isLoading) {
    return <Loading text="Initializing application..." />;
  }
  return isLoading ? (
    <Loading text="Initializing application..." />
  ) : (
    <div className="App">
      <Router>
        {inits.length > 0 && (
          <Navigation
            activePage={activePage}
            setActivePage={setActivePage}
            inits={inits}
            posts={posts}
          />
        )}
        <main>
          {inits.length > 0 && announcement && (
            <Box
              sx={{
                mt:
                  announcement && announcement.message
                    ? { xs: '350px', sm: '300px', md: '250px' }
                    : '200px',
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '3fr 5fr',
                  md: '4fr 9fr',
                  lg: '1fr 3fr',
                },
                gap: 2,
                color: colorMainLetter,
              }}
            >
              {/* bên trái */}
              {images.length > 0 && inits.length > 0 && (
                <AnouncementAds images={images} inits={inits} />
              )}
              {/* bên phải */}
              {posts.length > 0 && inits.length > 0 && images.length > 0 && (
                <Mainroot postNews={posts} images={images} inits={inits} />
              )}
            </Box>
          )}
        </main>
        <footer>
          {inits.length > 0 && (
            <LanguageButton
              inits={inits}
              anchorElLang={anchorElLang}
              handleCloseLangMenu={handleCloseLangMenu}
              handleOpenLangMenu={handleOpenLangMenu}
            />
          )}
        </footer>
      </Router>
    </div>
  );
}

export default App;
