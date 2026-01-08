import { useState, useEffect } from 'react';
import { backend } from '../Constain';

// lấy dữ liệu cả bảng posts
const fetchPosts = async () => {
  try {
    const res = await fetch(`${backend}posts/public`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    } else {
      alert('Get data fail: ' + data.message);
      return [];
    }
  } catch (err) {
    console.error(err);
    alert('Server error when getting data from posts');
    return [];
  }
};
const fetchPostsAdmin = async () => {
  try {
    const res = await fetch(`${backend}posts`);
    const data = await res.json();
    if (data.success) {
      return data.data;
    } else {
      alert('Get data fail: ' + data.message);
      return [];
    }
  } catch (err) {
    console.error(err);
    alert('Server error when getting data from posts');
    return [];
  }
};
export const useFetchPosts = (isAdmin) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = isAdmin ? await fetchPostsAdmin() : await fetchPosts();
        const parsedPosts = (data || []).map((post) => {
          // parse images
          const images =
            typeof post.images === 'string'
              ? JSON.parse(post.images)
              : Array.isArray(post.images)
              ? post.images
              : [];
          // parse time
          let formattedTime = '';
          if (post.time) {
            const date = new Date(post.time);
            // Format: Dec 25, 2025 10:00 PM
            formattedTime = date.toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });
          }
          return {
            ...post,
            images,
            time: formattedTime,
          };
        });
        setPosts(parsedPosts);
      } catch (err) {
        console.error(err);
        alert('Server error when getting data from posts');
      }
    };
    loadPosts();
  }, [isAdmin]);
  return { posts };
};
/**
 * Hook upsert / update 1 post
 *
 * Usage:
 * const { upsertPost, loading, error } = useUpsertPost();
 * upsertPost({ post, onSuccess: () => {} });
 */
export const useUpsertPost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /**
   * upsertPost({ post, onSuccess })
   * post: object (1 post duy nhất)
   * onSuccess: callback sau khi thành công
   */
  const upsertPost = async ({ post, onSuccess }) => {
    if (!post || typeof post !== 'object') {
      alert('Lack data from post!');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backend}posts/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ post }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Post saved!');
        if (onSuccess) onSuccess(result);
      } else {
        alert('Save post failed: ' + result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('❌ Upsert post error:', err);
      alert('Server error when saving data from posts');
      setError(err.message || 'Server error');
    } finally {
      setLoading(false);
    }
  };
  return { upsertPost, loading, error };
};

export const useDeletePost = () => {
  /**
   * deletePost({ id, onSuccess })
   */
  const deletePost = async ({ id, onSuccess }) => {
    if (!id) {
      alert('Missing post id');
      return;
    }
    try {
      const res = await fetch(`${backend}posts/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        alert('Post deleted successfully!');
        if (onSuccess) onSuccess(result);
      } else {
        alert('Delete failed: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error when deleting post');
    }
  };
  return { deletePost };
};

export const useUpdateAllPosts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateAllPosts = async ({ posts, onSuccess }) => {
    if (!Array.isArray(posts) || posts.length === 0) {
      setError('Posts phải là một mảng không rỗng');
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await fetch(`${backend}posts/update-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posts }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Cập nhật thất bại');
      }
      setData(result); // { success: true, message: ..., results: [...] }
      onSuccess?.(result); // Gọi callback thành công, truyền luôn data về
    } catch (err) {
      setError(err.message || 'Lỗi server');
      console.error('Update all posts error:', err);
    } finally {
      setLoading(false);
    }
  };
  return { updateAllPosts, data, loading, error };
};
