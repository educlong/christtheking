import * as React from 'react';
import {
  Typography,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  handleUploadImg,
  useFetchImages,
  useInsertImage,
  useUpdateImage,
} from '../server/ImgsHandle';
import { useState } from 'react';

export default function Logos({
  titleUpload,
  type,
  upload,
  notes,
  imgSelect,
  maxWPic,
  maxHPic,
  submit,
}) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const { handleInsertImage } = useInsertImage();
  const [checkedFirstAd, setCheckedFirstAd] = useState(false);
  const { updateImage } = useUpdateImage();
  const { images } = useFetchImages(type);
  const handleClick = async () => {
    if (upload) {
      await handleUploadImg({ file, type, setPreview, setFile });
    } else {
      if (checkedFirstAd) {
        await updateImage({ file, id: images[0].id, type });
      } else {
        await handleInsertImage(file, type);
      }
    }
    window.location.reload();
  };
  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Box>
          <Typography mb={1} fontWeight="bold" whiteSpace="nowrap">
            {titleUpload}
          </Typography>
          <Box
            sx={{
              fontSize: 'x-small',
              fontWeight: 'bold',
              color: 'red',
            }}
          >
            {notes}
          </Box>
        </Box>
        <Button
          variant="contained"
          component="label"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          {imgSelect}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const img = new Image();
              img.src = URL.createObjectURL(file);
              img.onload = () => {
                if (img.width > maxWPic || img.height > maxHPic) {
                  alert(notes);
                  return;
                }
                setPreview(img.src); // Hiển thị preview// Sau khi pass kiểm tra → hiển thị ảnh
                setFile(file); // Lưu file thực tế để upload
              };
            }}
          />
        </Button>
      </Box>
      {/* RIGHT SIDE: Preview image */}
      {preview && (
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            component="img"
            src={preview}
            alt="preview"
            sx={{
              width: 80,
              height: 80,
              objectFit: 'cover',
              borderRadius: 2,
              border: '2px solid #ccc',
            }}
          />
          {preview ? (
            <>
              {!upload ? (
                <FormControlLabel
                  control={<Checkbox />}
                  label="Change First Ad"
                  checked={checkedFirstAd}
                  onChange={(e) => setCheckedFirstAd(e.target.checked)}
                />
              ) : null}
              <Button
                variant="contained"
                component="label"
                sx={{ textTransform: 'none', borderRadius: 2 }}
                onClick={handleClick}
              >
                {submit}
              </Button>
            </>
          ) : null}
        </Box>
      )}
    </Box>
  );
}
