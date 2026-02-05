import React, { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  TextField,
} from '@mui/material';
import { handleUploadPdf } from '../server/InitsHandle';
import { backend, typeBulletin, website } from '../Constain';
import {
  requestNotificationPermission,
  showNotification,
} from '../server/Notification';

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
  const bulletinInit = useMemo(
    () => [inits.find((item) => item.type === typeBulletin)],
    [inits]
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
    // Giới hạn dung lượng < 1MB
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (selected.size > maxSize) {
      alert('File size must be less than 1MB');
      e.target.value = null;
      return;
    }
    set_Files((prev) => {
      const next = [...prev];
      next[_index] = selected;
      return next;
    });
  };

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
        subject: bulletin,
        message: `<br />${note.replace(/\n/g, '<br />')}<br /><br />
        <div>Weekly Bulletin:</div>
             ${fileLinksHtml}
    <p>More details in: <a href="${website}" target="_blank" style="color: blue; text-decoration: underline;">
        ${website}
      </a></p>
  `,
        emails: emailsParishers,
        imgs: [],
      });
      alert('Emails sent successfully!');
      // 4️⃣ Hiển thị notification desktop
      showNotification('Weekly Bulletin Sent', {
        body: `The Weekly Bulletin "${bulletin}" has been sent to ${emailsParishers.length} recipients. Please check your email [tab "Updates"] for details.`,
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
