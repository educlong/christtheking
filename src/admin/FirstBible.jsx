import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
} from '@mui/material';
import { useUpsertInits } from '../server/InitsHandle';
import { typeFirstBible } from '../Constain';
import { ADConfigsSubmitBtn, ADConfigsTitle } from './AdminCustomes';

export default function FirstBible({ inits }) {
  const { upsertInits, loading } = useUpsertInits();
  const firstBibleInit = useMemo(
    () => [inits.find((item) => item.type === typeFirstBible)],
    [inits]
  );
  const firstBibleData = useMemo(() => {
    if (!firstBibleInit?.length) return null;
    try {
      return firstBibleInit[0].data;
    } catch {
      return null;
    }
  }, [firstBibleInit]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([firstBibleData]);
  }, [firstBibleData]);
  const handleSubmit = async () => {
    await upsertInits({
      type: typeFirstBible,
      data,
      onSuccess: () => {
        console.log('First Bible updated!');
      },
    });
    window.location.reload();
  };
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          {firstBibleInit && <ADConfigsTitle data={firstBibleInit[0].type} />}
          <TextField
            label="Message"
            fullWidth
            multiline
            minRows={4}
            value={data}
            onChange={(e) => setData(e.target.value)}
            inputProps={{ maxLength: 250 }}
          />
          <Stack direction="row" justifyContent="flex-end" mt={2}>
            <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
