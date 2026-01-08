import { useState, useCallback } from 'react';
import { compressImage } from '../server/ImgsHandle';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';

export const ADConfigsTitle = ({ data }) => (
  <Typography variant="h5" mb={3}>
    {data.toUpperCase()} Configuration
  </Typography>
);
export const ADConfigsSubmitBtn = ({ handleSubmit, loading, _100percent }) => (
  <Box mt={4} textAlign="center">
    <Button
      sx={{ width: _100percent }}
      variant="contained"
      color="primary"
      type="submit"
      size="large"
      onClick={handleSubmit}
      disabled={loading}
    >
      {loading ? 'Loading...' : 'Submit'}
    </Button>
  </Box>
);
export const ADConfigsAddItems = ({ handleAdd, add }) => (
  <Box mt={2}>
    <Button startIcon={<AddIcon />} variant="outlined" onClick={handleAdd}>
      Add {add}
    </Button>
  </Box>
);

export const AdsImg = ({
  images,
  handleDelete,
  size,
  noChangeFirstImg,
  postIdx,
}) => (
  <Box
    display="flex"
    alignItems="center"
    gap={1}
    sx={{ overflowX: 'hidden', paddingBottom: 1, overflowY: 'hidden' }}
  >
    {images.map((img, idx) => (
      <Box
        key={`${idx}-${img.id}`}
        sx={{
          position: 'relative',
          width: size,
          height: size,
          marginRight: 1,
        }}
      >
        {/* IMAGE */}
        <Box
          component="img"
          src={img.base64 ? img.base64 : img}
          alt="preview"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 1,
            border: '1px solid #ccc',
          }}
        />

        {/* BUTTON REMOVE (X) */}
        {noChangeFirstImg === true && idx === 0 ? null : (
          <Box
            onClick={() =>
              noChangeFirstImg
                ? handleDelete(img.id)
                : handleDelete(postIdx, idx)
            }
            sx={{
              position: 'absolute',
              top: -6,
              right: -6,
              width: 18,
              height: 18,
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '1px solid #888',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              color: 'red',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#ffebeb',
              },
            }}
          >
            x
          </Box>
        )}
      </Box>
    ))}
  </Box>
);

export const FormConfigSection = ({
  label,
  list,
  _value,
  handleChange,
  postConfig,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={_value ?? ''} // Truy cập đúng giá trị role trong listRoles
        onChange={handleChange}
      >
        {list.map((it, i) => (
          <MenuItem key={i} value={postConfig ? it.value : it}>
            {postConfig ? it.label : it}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

/**
 * @param {number} maxWidth - chiều rộng tối đa ảnh sau nén
 * @param {number} quality - chất lượng ảnh (0 → 1)
 * @param {string} field - field trong data (icon | img | avatar)
 */
export const useImageBase64Upload = ({
  maxWidth = 40,
  quality = 0.2,
  field = 'icon',
} = {}) => {
  const [previewMap, setPreviewMap] = useState({});
  const handleImageUpload = useCallback(
    async (file, index, setData) => {
      if (!file) return;
      // 1️⃣ Preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewMap((prev) => ({
        ...prev,
        [index]: previewUrl,
      }));
      // 2️⃣ Compress
      const compressedFile = await compressImage(file, maxWidth, quality);
      // 3️⃣ Base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result;
          // 4️⃣ Update data[index][field]
          setData((prev) => {
            const newData = [...prev];
            if (newData[index]) {
              newData[index] = {
                ...newData[index],
                [field]: base64,
              };
            }
            return newData;
          });
          resolve({ base64, previewUrl });
        };
        reader.readAsDataURL(compressedFile);
      });
    },
    [field, maxWidth, quality]
  );
  return {
    previewMap,
    handleImageUpload,
  };
};
