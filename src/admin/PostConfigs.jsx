import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  IconButton,
  Divider,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {
  ADConfigsSubmitBtn,
  ADConfigsTitle,
  AdsImg,
  FormConfigSection,
  useImageBase64Upload,
} from './AdminCustomes';
import { useMemo } from 'react';
import {
  useCleanupOldPostImages,
  useDeletePost,
  useUpsertPost,
} from '../server/PostsHandle';
import { website } from '../Constain';

export default function PostConfigs({
  _posts,
  isAdmin,
  pages,
  church,
  sendAnnouncement,
  emailsParishers,
}) {
  const churchOptions = [
    { label: 'All', value: -1 },
    ...church.map((c, index) => ({
      label: c.church,
      value: index,
    })),
  ];
  const pageOptions = pages
    .flatMap(
      (page, pageIndex) =>
        pageIndex !== pages.length - 1 &&
        page.sub.map((sub, subIndex) => ({
          label: `${page.main} - ${sub}`,
          value: `${pageIndex}-${subIndex}`, // dùng cho Select
          pageIndex,
          subIndex,
        }))
    )
    .slice(0, -1);
  const { upsertPost, loading } = useUpsertPost();
  const { deletePost } = useDeletePost();
  const [posts, setPosts] = useState(_posts);
  const [editingIndex, setEditingIndex] = useState(null);
  const { cleanupImages } = useCleanupOldPostImages();
  const handleChange = (index, field, value) => {
    setPosts((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const handleDeleteImg = (postIdx, idx) => {
    if (!window.confirm('Are you sure to delete this picture?')) return;
    setPosts((prev) =>
      prev.map((item) => {
        if (item.id !== postIdx) return item;
        return {
          ...item,
          images: item.images.filter((_, index) => index !== idx),
        };
      })
    );
  };
  const toggleEdit = (index) => {
    setEditingIndex((prev) => (prev === index ? null : index));
  };
  const createEmptyPost = () => ({
    title: '',
    page: 1,
    sub1: 0,
    location: -1,
    content: '',
    images: [],
    link_id: null,
    is_delete: 0,
  });
  const handleAddPost = () => {
    if (editingIndex !== null) {
      alert('Finish editing the current post first.');
      return;
    }
    setPosts((prev) => {
      const newPost = createEmptyPost();
      return [newPost, ...prev]; // thêm lên đầu cho dễ thấy
    });
    setEditingIndex(0); // mở edit cho post mới thêm
  };
  const { handleImageUpload } = useImageBase64Upload({
    maxWidth: 2048,
    quality: 0,
    field: 'temp', // field giả, KHÔNG dùng trực tiếp
  });
  const handleAddPostImage = async (postIndex, file) => {
    const result = await handleImageUpload(file, postIndex, setPosts);
    if (!result?.base64) return;
    setPosts((prev) =>
      prev.map((post, i) =>
        i === postIndex
          ? { ...post, images: [...post.images, result.base64] }
          : post
      )
    );
  };
  // utils youtube
  const isValidYouTubeId = (id) => /^[a-zA-Z0-9_-]{11}$/.test(id);
  const getYouTubeVideoId = (url) => {
    try {
      const u = new URL(url);
      // youtu.be short link
      if (u.hostname === 'youtu.be') {
        return u.pathname.slice(1);
      }
      // youtube.com
      if (
        u.hostname.includes('youtube.com') ||
        u.hostname.includes('m.youtube.com')
      ) {
        // watch?v=
        if (u.searchParams.get('v')) {
          return u.searchParams.get('v');
        }
        // /embed/ID or /shorts/ID
        const paths = u.pathname.split('/');
        const embedIndex = paths.findIndex((p) =>
          ['embed', 'shorts'].includes(p)
        );
        if (embedIndex !== -1 && paths[embedIndex + 1]) {
          return paths[embedIndex + 1];
        }
      }
    } catch (e) {
      console.error(e);
      return null;
    }
    return null;
  };
  const handleDelete = async (post) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this post?'
    );
    if (!confirmDelete) return;
    const clone = { ...post, is_delete: 1 };
    isAdmin
      ? await deletePost({
          id: post.id,
          onSuccess: () => window.location.reload(),
        })
      : await upsertPost({
          post: clone,
          onSuccess: () => window.location.reload(),
        });
  };
  const handleSubmit = async (post) => {
    if (!post) return;
    // clone & clean
    const clone = { ...post };
    delete clone.temp;
    // non-admin: chặn submit nếu không nằm trong top 6
    if (!isAdmin) {
      const top6Ids = [...posts]
        .sort((a, b) => b.id - a.id)
        .slice(0, 6)
        .map((p) => p.id);
      if (!top6Ids.includes(clone.id)) {
        alert('You are not allowed to submit this post');
        return;
      }
    } // Chuẩn hóa YouTube link
    if (clone.link_id) {
      const possibleId = clone.link_id.includes('http')
        ? getYouTubeVideoId(clone.link_id)
        : clone.link_id;
      clone.link_id = isValidYouTubeId(possibleId) ? possibleId : null;
    }
    try {
      if (!clone.id && emailsParishers.length >= 0) {
        if (!Array.isArray(emailsParishers) || emailsParishers.length === 0) {
          alert('No recipients selected. Email not sent.');
        } else {
          try {
            await sendAnnouncement({
              subject: clone.title,
              message: `<p>Hello,</p><p>I hope you are doing well. Here is the new post.</p>
              ${clone.content.replace(/\n/g, '<br />')}
<p>Website: <a href="${website}" target="_blank" style="color: blue; text-decoration: underline;">
${website}
</a></p>
                  <p>Thank you for being part of our parish community.</p>
                  <p>If you have any questions, feel free to reply to this email.</p>
                  <div>God bless you!</div>
                  <div>Christ the King Parish</div>`,
              emails: emailsParishers,
              // emails: ['educlong@gmail.com', 'lloonnggg@gmail.com'],
              imgs: clone.images,
            });
            alert('Emails sent successfully!');
          } catch (err) {
            console.error(err);
          }
        }
      }
    } finally {
      await upsertPost({
        post: clone,
        onSuccess: () => {
          window.location.reload();
        },
      });
    }
  };
  const displayedPosts = useMemo(() => {
    return isAdmin
      ? posts
      : [...posts]
          .sort((a, b) => b.id - a.id) // id cao → mới
          .slice(0, 6);
  }, [posts, isAdmin]);

  const handleRemoveOldImages = async () => {
    if (!window.confirm('Xóa ảnh các bài viết cũ hơn 2 năm?')) return;
    const result = await cleanupImages();
    alert(`Đã dọn ảnh cho ${result.affectedRows} bài viết`);
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <ADConfigsTitle data="Posts" />
      <Stack spacing={2}>
        {displayedPosts.map((post, index) => {
          const isEditing = editingIndex === index;
          return (
            (post.page !== pages.length - 1 || isAdmin) && (
              <Card key={index} variant="outlined">
                <CardContent>
                  {/* ===== TITLE ROW ===== */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '6fr 6fr',
                        md: '9fr 3fr',
                      },
                      gap: 2,
                    }}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">
                      {post.title || '(No title)'}
                    </Typography>
                    <Box>
                      <Stack spacing={2} direction={{ xs: 'row' }}>
                        <IconButton onClick={() => toggleEdit(index)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          sx={{ mx: 1 }}
                          color="error"
                          onClick={() => handleDelete(post)}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <ADConfigsSubmitBtn
                          handleSubmit={() => handleSubmit(post)}
                          loading={loading}
                        />
                      </Stack>
                    </Box>
                  </Box>
                  {/* ===== EDIT MODE ===== */}
                  {isEditing && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Stack spacing={2}>
                        <TextField
                          label="Title"
                          fullWidth
                          value={post.title}
                          onChange={(e) =>
                            handleChange(index, 'title', e.target.value)
                          }
                        />
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                        >
                          <FormConfigSection
                            label="Page / Section"
                            list={pageOptions}
                            _value={
                              post.page !== undefined && post.sub1 !== undefined
                                ? `${post.page}-${post.sub1}`
                                : ''
                            }
                            handleChange={(e) => {
                              const [page, sub1] = e.target.value
                                .split('-')
                                .map(Number);
                              handleChange(index, 'page', page);
                              handleChange(index, 'sub1', sub1);
                            }}
                            postConfig
                          />
                          <FormConfigSection
                            label="Church"
                            list={churchOptions}
                            _value={
                              post.location !== undefined ? post.location : ''
                            }
                            handleChange={(e) =>
                              handleChange(
                                index,
                                'location',
                                Number(e.target.value)
                              )
                            }
                            postConfig
                          />
                          <TextField
                            label="YouTube Video ID"
                            fullWidth
                            value={post.link_id || ''}
                            onChange={(e) =>
                              handleChange(index, 'link_id', e.target.value)
                            }
                          />
                        </Stack>
                        <TextField
                          label="Content"
                          multiline
                          minRows={4}
                          fullWidth
                          value={post.content || ''}
                          onChange={(e) =>
                            handleChange(index, 'content', e.target.value)
                          }
                        />
                        <Button
                          variant="contained"
                          component="label"
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          Choose Picture
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              await handleAddPostImage(index, file);
                              // reset để chọn lại cùng file vẫn chạy
                              e.target.value = '';
                            }}
                          />
                        </Button>
                        {post.images.length > 0 && (
                          <Stack direction="row" spacing={1}>
                            <AdsImg
                              images={post.images}
                              handleDelete={handleDeleteImg}
                              size={80}
                              noChangeFirstImg={false}
                              postIdx={post.id}
                            />
                          </Stack>
                        )}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          );
        })}
      </Stack>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddPost}
        >
          Add a Post
        </Button>
      </Box>
      {isAdmin && (
        <Box display="flex" justifyContent="flex-end" mt={3}>
          <Button
            variant="contained"
            color="error"
            onClick={handleRemoveOldImages}
            sx={{ textTransform: 'none' }}
          >
            Remove Old Images
          </Button>
        </Box>
      )}
    </Box>
  );
}
