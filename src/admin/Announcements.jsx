import React, { useState, useEffect, useMemo } from 'react';
import { Box, Card, CardContent, Typography, TextField } from '@mui/material';
import { useUpsertInits } from '../server/InitsHandle';
import { now, typeAnnouncement, website } from '../Constain';
import { ADConfigsSubmitBtn, ADConfigsTitle } from './AdminCustomes';

export default function AnnouncementsForm({
  inits,
  isAdmin,
  notes,
  sendAnnouncement,
  emailsParishers,
}) {
  const { upsertInits, loading } = useUpsertInits();
  const announcementInit = useMemo(
    () => [inits.find((item) => item.type === typeAnnouncement)],
    [inits]
  );
  const announcementData = useMemo(() => {
    if (!announcementInit?.length) return null;
    try {
      return JSON.parse(announcementInit[0].data);
    } catch {
      return null;
    }
  }, [announcementInit]);
  const [data, setData] = useState([]);
  const [days, setDays] = useState(0);
  useEffect(() => {
    setData([announcementData]); // Chỉ 1 announcement
  }, [announcementData]);
  // Handlers
  const handleTitleChange = (value) => {
    setData((prev) => [{ ...prev[0], title: value }]);
  };
  const handleMessageChange = (value) => {
    setData((prev) => [{ ...prev[0], message: value }]);
  };
  const handleSubmit = async () => {
    if (!announcementData) return;
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + days);
    const payload = {
      ...data[0],
      expiryDate: expiryDate.toISOString(), // lưu vào DB
    };
    try {
      if (emailsParishers.length > 0) {
        if (!Array.isArray(emailsParishers) || emailsParishers.length === 0) {
          alert('No recipients selected. Email not sent.');
        } else if (!payload?.message || payload.message.trim() === '') {
          alert('Message content is empty. Email not sent.');
        } else {
          try {
            await sendAnnouncement({
              subject: payload.title,
              message: `
                ${payload.message}
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
      }
    } finally {
      // Phần này luôn chạy dù có alert hay lỗi
      await upsertInits({
        type: announcementInit[0]?.type,
        data: payload,
        onSuccess: () => console.log('Announcement updated!'),
      });
      window.location.reload();
    }
  };
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {announcementData && <ADConfigsTitle data={announcementData.title} />}

      {data.map((item, index) => (
        <Card key={index} variant="outlined">
          <CardContent>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
                alignItems: 'center',
              }}
            >
              {/* Cột trái: Title */}
              {isAdmin ? (
                <TextField
                  label="Title"
                  fullWidth
                  value={item.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
              ) : (
                <Typography>{item.title}</Typography>
              )}
              {/* Cột phải: Message */}
              <Box>
                <TextField
                  label="Message"
                  fullWidth
                  value={item.message}
                  inputProps={{ maxLength: 250 }}
                  onChange={(e) => handleMessageChange(e.target.value)}
                />
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
              <Typography>
                How many days will you want to show this announcement?
              </Typography>
              <TextField
                label="Display for days"
                type="number"
                value={item.days}
                onChange={(e) => setDays(Number(e.target.value))}
              />
            </Box>
          </CardContent>
        </Card>
      ))}
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
