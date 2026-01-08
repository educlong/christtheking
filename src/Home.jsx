import { useState } from 'react';
import { Box, Button } from '@mui/material';
import PostCard from './rightsideCard/PostCard';
import { Pastors } from './rightsideContact/Pastors';
import ParishCouncils from './rightsideContact/ParishCouncils';
import MemoryBook from './rightsideContact/MemoryBook';
import Forms from './rightsideContact/Forms';
import { useFetchInits } from './server/InitsHandle';
import { displayxs } from './Constain';

export default function Home({
  pages,
  postNews,
  showContact,
  showBible,
  showContent,
  showSubContact,
}) {
  const { inits } = useFetchInits();
  const POSTS_PER_LOAD = 10;
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_LOAD);
  return (
    <Box>
      {showBible && (
        <Box display={{ displayxs }}>
          {inits && inits.length > 0 && <Pastors inits={inits} />}
        </Box>
      )}
      {postNews
        .slice(0, visibleCount)
        .map(
          (post, idx) =>
            showContent && (
              <Box key={`${post.title} - ${idx}`}>
                {pages && pages.length > 0 && (
                  <PostCard
                    pages={pages}
                    title={post.title}
                    page={post.page}
                    sub1={post.sub1}
                    time={post.time}
                    location={post.location}
                    content={post.content}
                    images={post.images}
                    link_id={post.link_id}
                  />
                )}
              </Box>
            )
        )}
      {visibleCount < postNews.length && (
        <Box display="flex" justifyContent="center" my={3}>
          <Button
            variant="contained"
            onClick={() => setVisibleCount((prev) => prev + POSTS_PER_LOAD)}
          >
            Loading more
          </Button>
        </Box>
      )}
      {!showContact ? null : (
        <>
          {(showSubContact === -1 || showSubContact === 0) &&
          inits.length > 0 ? (
            <ParishCouncils inits={inits} />
          ) : (
            ''
          )}
          {(showSubContact === -1 || showSubContact === 1) &&
          inits.length > 0 ? (
            <Forms page={showSubContact} inits={inits} />
          ) : (
            ''
          )}
          {(showSubContact === -1 || showSubContact === 2) &&
          inits.length > 0 ? (
            <MemoryBook inits={inits} />
          ) : (
            ''
          )}
        </>
      )}
    </Box>
  );
}
