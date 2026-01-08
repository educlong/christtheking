import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useUpsertInits } from '../server/InitsHandle';
import { typeSacraments } from '../Constain';
import {
  ADConfigsAddItems,
  ADConfigsSubmitBtn,
  ADConfigsTitle,
} from './AdminCustomes';

export default function SacramentsForm({ inits, isAdmin }) {
  const { upsertInits, loading } = useUpsertInits();
  const sacramentsInit = useMemo(
    () => [inits.find((item) => item.type === typeSacraments)],
    [inits]
  );
  const sacramentsData = useMemo(() => {
    if (!sacramentsInit?.length) return null;
    try {
      return JSON.parse(sacramentsInit[0].data);
    } catch {
      return null;
    }
  }, [sacramentsInit]);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (sacramentsData?.content) setData(sacramentsData.content);
  }, [sacramentsData]);
  // Handlers
  const handleTitleChange = (index, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title: value } : item))
    );
  };
  const handleSubChange = (index, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, sub: value } : item))
    );
  };
  const handleAddSacrament = () => {
    setData((prev) => [
      ...prev,
      { title: 'New Sacrament', sub: 'Description...' },
    ]);
  };
  const handleDeleteSacrament = (index) => {
    setData((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async () => {
    if (!sacramentsData) return;
    const payload = { ...sacramentsData, content: data };
    await upsertInits({
      type: sacramentsInit[0]?.type,
      data: payload,
      onSuccess: () => console.log('Sacraments updated!'),
    });
    window.location.reload();
  };
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {sacramentsData && <ADConfigsTitle data={sacramentsData.name} />}
      <Stack spacing={3}>
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
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      label="Title"
                      fullWidth
                      value={item.title}
                      onChange={(e) => handleTitleChange(index, e.target.value)}
                    />
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSacrament(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography>{item.title}</Typography>
                )}
                {/* Cột phải: Sub */}
                <TextField
                  label="Description / Sub"
                  fullWidth
                  value={item.sub}
                  onChange={(e) => handleSubChange(index, e.target.value)}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
      {isAdmin && (
        <ADConfigsAddItems handleAdd={handleAddSacrament} add="Sacrament" />
      )}
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
