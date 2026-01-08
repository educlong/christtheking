import React, { useState, useMemo } from 'react';
import { Box, Button, Typography, LinearProgress } from '@mui/material';
import { handleUploadPdf } from '../server/InitsHandle';
import { backend, typeBulletin, website } from '../Constain';

const WeeklyBulletin = ({
  inits,
  type,
  notes,
  sendAnnouncement,
  emailsParishers,
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const bulletinInit = useMemo(
    () => [inits.find((item) => item.type === typeBulletin)],
    [inits]
  );
  const bulletin = bulletinInit.length > 0 ? bulletinInit[0].data : '';
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    // Kiểm tra đúng PDF
    if (selected.type !== 'application/pdf') {
      alert('Chỉ chấp nhận file PDF');
      e.target.value = null;
      return;
    }
    // Giới hạn dung lượng < 1MB
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (selected.size > maxSize) {
      alert('File quá lớn. Vui lòng chọn file dưới 1MB');
      e.target.value = null;
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      if (!Array.isArray(emailsParishers) || emailsParishers.length === 0) {
        alert('No recipients selected. Email not sent.');
      } else {
        try {
          await sendAnnouncement({
            subject: bulletin,
            message: `
    <p>
      <a href="${backend}pdf/bulletin" target="_blank" style="color: blue; text-decoration: underline;">
        ${file.name}
      </a>
    </p>
    <p>More details in: <a href="${website}" target="_blank" style="color: blue; text-decoration: underline;">
        ${website}
      </a></p>
  `,
            emails: emailsParishers,
            imgs: [],
          });
          alert('Emails sent successfully!');
        } catch (err) {
          console.error(err);
        }
      }
    } finally {
      // Phần này luôn chạy dù có alert hay lỗi
      setLoading(true);
      await handleUploadPdf({ file, type, setFile });
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

      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="pdf-upload-input"
      />
      <label htmlFor="pdf-upload-input">
        <Button variant="contained" component="span">
          Select file PDF
        </Button>
      </label>

      {file && (
        <Typography variant="body1" mt={2}>
          Selected file: {file.name}
        </Typography>
      )}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={!file || loading}
          onClick={handleUpload}
        >
          {loading ? 'Đang upload...' : 'Upload'}
        </Button>
      </Box>
      <Box
        sx={{
          fontSize: 'x-small',
          fontWeight: 'bold',
          color: 'red',
        }}
      >
        {notes}
      </Box>
      {loading && <LinearProgress sx={{ mt: 2 }} />}
    </Box>
  );
};
export default WeeklyBulletin;
