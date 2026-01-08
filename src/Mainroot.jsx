import { Routes, Route } from 'react-router-dom';
import {
  displayxs,
  Homepage,
  now,
  saveAuth,
  settings,
  typePages,
} from './Constain';
import Home from './Home';
import { Box } from '@mui/material';
import Ads from './leftside/Ads';
import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthPage from './admin/AuthPage';
import Dashboard from './admin/Dashboard';

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function useGroupedPosts(postNews, pages) {
  return useMemo(() => {
    if (!pages || pages.length === 0) return [];
    // Tạo cấu trúc group rỗng chính xác theo pages
    const grouped = pages.map((page) => ({
      all: [], // toàn bộ bài của page
      subs: page.sub.map(() => []), // bài theo từng sub1
    }));
    // Duyệt đúng 1 lần
    postNews.forEach((post) => {
      const { page, sub1 } = post;
      // Tránh lỗi nếu data sai chỉ số
      if (!grouped[page]) return;
      // Gom bài về page chính
      grouped[page].all.push(post);
      // Gom bài về page.sub
      if (grouped[page].subs[sub1]) {
        grouped[page].subs[sub1].push(post);
      }
    });
    return grouped; // trả về cấu trúc đã gom
  }, [postNews, pages]);
}
export default function Mainroot({ postNews, images, inits }) {
  const pages = useMemo(
    () =>
      inits.length > 0
        ? JSON.parse(inits.find((item) => item.type === typePages).data)
        : [],
    [inits]
  );
  const auth = JSON.parse(localStorage.getItem(saveAuth));
  const _now = now.getTime();
  // Gom dữ liệu 1 lần duy nhất
  const grouped = useGroupedPosts(postNews, pages);
  // Tạo routes cho pages và sub pages, chỉ render 1 lần
  const routePages = useMemo(() => {
    if (!pages || pages.length === 0) return [];
    return pages
      .map((page, pageIndex) => {
        const routes = [];
        // Route chính của page
        if (grouped[pageIndex]?.all?.length > 0) {
          routes.push(
            <Route
              key={`page-${page.main}`}
              path={`/${page.main}`}
              element={
                <Home
                  pages={pages}
                  postNews={grouped[pageIndex].all}
                  showContact={pageIndex === pages.length - 1}
                  showBible={pageIndex !== pages.length - 1}
                  showContent={pageIndex !== pages.length - 1}
                  showSubContact={-1}
                />
              }
            />
          );
        }
        // Route các sub page
        page.sub.forEach((subName, subIndex) => {
          if (grouped[pageIndex]?.subs[subIndex]?.length > 0) {
            routes.push(
              <Route
                key={`sub-${pageIndex}-${subIndex}`}
                path={`/${page.main}/${page.main}${subIndex}`}
                element={
                  <Home
                    pages={pages}
                    postNews={grouped[pageIndex].subs[subIndex]}
                    showContact={pageIndex === pages.length - 1}
                    showBible={
                      !(pageIndex === pages.length - 1 && subIndex === 0)
                    }
                    showContent={pageIndex !== pages.length - 1}
                    showSubContact={subIndex}
                  />
                }
              />
            );
          }
        });
        return routes;
      })
      .flat();
  }, [pages, grouped]);

  return (
    <Box
      sx={{
        borderRadius: 3,
        border: '1px solid rgba(255,255,255,0.1)',
        borderLeft: 'none',
        borderRight: 'none',
        pl: 3,
        pr: 0,
        backgroundImage:
          'radial-gradient(circle at center, rgba(255,255,255,0.05) 0, transparent 70%)',
      }}
    >
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              pages={pages}
              postNews={postNews}
              showContact={true}
              showBible={true}
              showContent={true}
              showSubContact={-1}
            />
          }
        />
        <Route
          path={`/${Homepage}`}
          element={
            <Home
              pages={pages}
              postNews={postNews}
              showContact={true}
              showBible={true}
              showContent={true}
              showSubContact={-1}
            />
          }
        />
        {routePages}
        <Route path={`/${settings[0].name}`} element={<AuthPage />} />
        <Route
          path={`/${settings[1].name}`}
          element={
            auth && _now < auth.expires ? (
              <Dashboard
                auth={auth}
                inits={inits}
                posts={postNews}
                images={images}
              />
            ) : (
              <AuthPage />
            )
          }
        />
      </Routes>
      <Box sx={{ mt: '100px', display: displayxs }}>
        <Ads images={images} inits={inits} />
      </Box>
    </Box>
  );
}
