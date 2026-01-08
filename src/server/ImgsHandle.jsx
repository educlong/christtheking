import { useState, useEffect } from 'react';
import { backend } from '../Constain';
import { useCallback } from 'react';

export function compressImage(file, maxSize = 1024, quality = 0.3) {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => (img.src = reader.result);
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      } else if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; // tránh nền đen PNG
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(file);
          const newFile = new File(
            [blob],
            file.name.replace(/\.\w+$/, '.jpg'),
            { type: 'image/jpeg' }
          );
          resolve(newFile);
        },
        'image/jpeg',
        quality
      );
    };
    reader.readAsDataURL(file);
  });
}

// upload ảnh theo type
export const handleUploadImg = async ({ file, type, setPreview, setFile }) => {
  if (!file) return;
  // Resize / nén bằng canvas
  const compressedFile = await compressImage(file); // max width/height = 1024px
  const formData = new FormData();
  formData.append('image', compressedFile);
  // Gửi type để backend biết update ảnh nào
  // Ví dụ type = "logo_parish" hoặc "logo_holyyear"
  formData.append('type', type);
  try {
    const res = await fetch(`${backend}upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      alert('Upload successfully!');
      setPreview(null);
      setFile(null);
      window.location.reload(); // <-- reload trang
    } else {
      alert('Upload fail: ' + data.message);
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi server');
  }
};
// ==== UPDATE ảnh theo id + type ====
export const useUpdateImage = () => {
  const updateImage = async ({ file, id, type }) => {
    if (!file) return { success: false, message: 'No file selected' };
    const compressedFile = await compressImage(file); // max width/height = 1024px
    const formData = new FormData();
    formData.append('image', compressedFile);
    formData.append('id', id);
    formData.append('type', type);
    try {
      const res = await fetch(`${backend}upload/update`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!data.success) {
        alert('Update fail: ' + data.message);
      }
      console.log(data);
      return data;
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, message: 'Server error' };
    }
  };
  return { updateImage };
};

// INSERT ảnh mới vào database
export const useInsertImage = () => {
  // INSERT ảnh mới vào database
  const handleInsertImage = useCallback(async (file, type) => {
    if (!file) {
      alert('No file selected');
      return { success: false, message: 'No file' };
    }
    const compressedFile = await compressImage(file); // max width/height = 1024px
    const formData = new FormData();
    formData.append('image', compressedFile);
    formData.append('type', type);
    try {
      const res = await fetch(`${backend}upload/add`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('Upload successfully!');
      } else {
        alert('Upload fail: ' + data.message);
      }
      return data;
    } catch (error) {
      console.error('Insert error:', error);
      alert('Server error');
      return { success: false, message: 'Server error' };
    }
  }, []);

  return {
    handleInsertImage,
  };
};
// gọi hình ảnh
const fetchImages = async ({ type }) => {
  try {
    const res = await fetch(`${backend}images`);
    const data = await res.json();
    if (data.success) {
      const imgs = data.data.filter((img) => img.type === type);
      return imgs;
    } else {
      alert('get a photo fail: ' + data.message);
      return [];
    }
  } catch (err) {
    console.error(err);
    alert('Server error when getting image');
    return [];
  }
};
export const useFetchImages = (type) => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    const loadImages = async () => {
      const imgs = await fetchImages({ type });
      setImages(imgs || []);
    };
    loadImages();
  }, [type]);
  return { images };
};
/**
 * Hook xóa image theo id
 *
 * Usage:
 * const { deleteImage } = useDeleteImage();
 * deleteImage({ id, onSuccess });
 */
export const useDeleteImage = () => {
  const deleteImage = async ({ id, onSuccess }) => {
    if (!id) {
      alert('Missing image id');
      return;
    }
    try {
      const res = await fetch(`${backend}image/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.success) {
        if (onSuccess) onSuccess(result);
      } else {
        alert('Delete failed: ' + result.message);
      }
    } catch (err) {
      console.error(err);
      alert('Server error when deleting image');
    }
  };
  return { deleteImage };
};
