import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  TextField,
  Stack,
} from '@mui/material';
import { handleUploadPdf } from '../server/InitsHandle';
import { backend, typeBulletin, website } from '../Constain';
import {
  requestNotificationPermission,
  showNotification,
} from '../server/Notification';
import { useImageBase64Upload, AdsImg } from './AdminCustomes';

const WeeklyBulletin = ({
  inits,
  type,
  notes,
  sendAnnouncement,
  emailsParishers,
}) => {
  const MAX_FILES = 5;
  const [_files, set_Files] = useState(Array(MAX_FILES).fill(null));
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const [images, setImages] = useState([]); // base64 images
  const bulletinInit = useMemo(
    () => [inits.find((item) => item.type === typeBulletin)],
    [inits],
  );
  useEffect(() => {
    // Yêu cầu permission khi component mount
    requestNotificationPermission();
  }, []);
  const bulletin = bulletinInit.length > 0 ? bulletinInit[0].data : '';
  const handleFileChange = (e, _index) => {
    const selected = e.target.files[0];
    if (!selected) return;
    // Kiểm tra đúng PDF
    if (selected.type !== 'application/pdf') {
      alert('PDF File only');
      e.target.value = null;
      return;
    }
    // Giới hạn dung lượng < 2MB
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (selected.size > maxSize) {
      alert('File size must be less than 2MB');
      e.target.value = null;
      return;
    }
    set_Files((prev) => {
      const next = [...prev];
      next[_index] = selected;
      return next;
    });
  };
  const { handleImageUpload } = useImageBase64Upload({
    maxWidth: 2048,
    quality: 0.8,
    field: 'temp',
  });
  const handleAddImage = async (file) => {
    const result = await handleImageUpload(
      file,
      0,
      () => {}, // 👈 fake setData
    );
    if (!result?.base64) return;

    setImages((prev) => [...prev, result.base64]);
  };

  const handleDeleteImage = (_, idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };
  const adsImages = useMemo(
    () =>
      images.map((base64, index) => ({
        id: index, // fake id, chỉ để AdsImg dùng
        base64,
      })),
    [images],
  );

  const handleUpload = async () => {
    if (!_files) return;
    // Phần này luôn chạy dù có alert hay lỗi
    setLoading(true);
    try {
      // 1️⃣ UPLOAD TẤT CẢ FILE
      for (let i = 0; i < _files.length; i++) {
        if (!_files[i]) continue;
        await handleUploadPdf({
          file: _files[i],
          type,
          position: i, // 🔥 QUAN TRỌNG
          setFile: () => {},
        });
      }
      // 2️⃣ CHECK EMAIL
      if (!Array.isArray(emailsParishers) || emailsParishers.length === 0) {
        alert('No recipients selected. Email not sent.');
        return;
      }
      const fileLinksHtml = _files
        .map((file, index) => {
          if (!file) return '';
          const pdfType = `${type}${index === 0 ? '' : index}`;
          return `
      <p>
        <a href="${backend}pdf/${pdfType}" target="_blank"
           style="color: blue; text-decoration: underline;">
          ${file.name}
        </a>
      </p>
    `;
        })
        .join('');
      // 4️⃣ SEND EMAIL
      await sendAnnouncement({
        subject: 'This Week at Christ the King Parish',
        message: `<p>Hello,</p><p>I hope you are doing well. Here is the information for this week:</p>
        ${note.replace(/\n/g, '<br />')}
             <div>Note from the Parish Office:</div> ${fileLinksHtml}
    <p>Website: <a href="${website}" target="_blank" style="color: blue; text-decoration: underline;">
        ${website}
      </a></p>
                  <p>Thank you for being part of our parish community.</p>
                  <p>If you have any questions, feel free to reply to this email.</p>
                  <div>God bless you!</div>
                  <div>Christ the King Parish</div>
  `,
        emails: emailsParishers,
        // emails: ['educlong@gmail.com', 'lloonnggg@gmail.com'],
        imgs: images, // ✅ BASE64 IMAGES
      });
      alert('Emails sent successfully!');
      // 4️⃣ Hiển thị notification desktop
      showNotification('Message from Christ the King Parish', {
        body: `The Message from Christ the King Parish "${bulletin}" has been sent to ${emailsParishers.length} recipients. Please check your email [tab "Updates"] for details.`,
        icon: '../../public/vite.svg', // bạn có thể thay bằng logo
      });
    } catch (err) {
      console.error(err);
      alert('Upload or email failed');
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };
  return (
    <Box
      sx={{
        border: '1px dashed gray',
        borderRadius: 2,
        p: 3,
        textAlign: 'center',
        width: 400,
        mx: 'auto',
      }}
    >
      <Typography variant="h6" mb={2}>
        Upload {bulletin}
      </Typography>
      {_files.map((_file, _index) => (
        <Box
          key={_index}
          mb={2}
          sx={{
            border: '1px solid gray', // viền bao quanh
            borderRadius: 2, // bo góc
            p: 2, // padding bên trong
            backgroundColor: '#f9f9f9', // nền nhạt cho dễ nhìn
          }}
        >
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => handleFileChange(e, _index)}
            style={{ display: 'none' }}
            id={`pdf-input-${_index}`}
          />
          <label htmlFor={`pdf-input-${_index}`}>
            <Button variant="contained" component="span">
              Select file PDF
            </Button>{' '}
            {_index === 0 ? '<= Main Weekly Bulletin' : ''}
          </label>

          {_file && (
            <Typography variant="body1" mt={2}>
              Selected file: {_file.name}
            </Typography>
          )}
        </Box>
      ))}
      <TextField
        label="Message"
        fullWidth
        multiline
        minRows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        component="label"
        sx={{ textTransform: 'none', borderRadius: 2, mt: 2 }}
      >
        Choose Picture
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            await handleAddImage(file);
            e.target.value = '';
          }}
        />
      </Button>
      {adsImages.length > 0 && (
        <Stack direction="row" spacing={1} mt={2}>
          <AdsImg
            images={adsImages}
            handleDelete={(_, idx) => handleDeleteImage(null, idx)}
            size={80}
            noChangeFirstImg={false}
            postIdx={-1}
          />
        </Stack>
      )}

      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={loading || _files.every((f) => !f)}
          onClick={handleUpload}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </Box>
      <Box
        sx={{
          fontSize: 'x-small',
          fontWeight: 'bold',
          color: 'red',
          mt: 1,
        }}
      >
        {notes}
      </Box>
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};
export default WeeklyBulletin;
