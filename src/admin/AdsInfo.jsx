import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useUpsertInits } from '../server/InitsHandle';
import { typeAds_info } from '../Constain';
import { ADConfigsSubmitBtn, ADConfigsTitle } from './AdminCustomes';

export default function AdvertisingContactForm({ inits }) {
  const { upsertInits, loading } = useUpsertInits();
  const advertisingInit = useMemo(
    () => inits.find((item) => item.type === typeAds_info),
    [inits]
  );
  const advertisingData = useMemo(() => {
    if (!advertisingInit?.data) return null;
    try {
      return JSON.parse(advertisingInit.data);
    } catch {
      return null;
    }
  }, [advertisingInit]);
  const [data, setData] = useState({
    title: '',
    mr: '',
    email: '',
  });
  useEffect(() => {
    setData(advertisingData);
  }, [advertisingData]);
  /* -------- Handlers -------- */
  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async () => {
    await upsertInits({
      type: advertisingInit?.type,
      data,
      onSuccess: () => console.log('Advertising contact updated'),
    });
    window.location.reload();
  };
  /* -------- UI -------- */
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {advertisingData && <ADConfigsTitle data={advertisingData.title} />}
      <Card variant="outlined">
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            {/* LEFT COLUMN */}
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={data.title}
                fullWidth
                onChange={(e) => handleChange('title', e.target.value)}
              />
              <TextField
                label="Contact Name"
                value={data.mr}
                fullWidth
                onChange={(e) => handleChange('mr', e.target.value)}
              />
            </Stack>
            {/* RIGHT COLUMN */}
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={data.email}
                fullWidth
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
