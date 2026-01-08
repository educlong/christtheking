import React, { useEffect, useMemo, useState } from 'react';
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
import { typeRenew } from '../Constain';
import { ADConfigsSubmitBtn, useImageBase64Upload } from './AdminCustomes';

export default function Outsources({ inits, isAdmin, maxSize, notes }) {
  
  const init = useMemo(
    () => [inits.find((item) => item.type === typeRenew)],
    [inits]
  );
  const { upsertInits, loading } = useUpsertInits();
  const initData = useMemo(() => {
    if (init && init.length > 0) {
      try {
        return JSON.parse(init[0].data);
      } catch {
        return [];
      }
    }
    return [];
  }, [init]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(initData);
  }, [initData]);

  const handleChange = (index, field, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const { previewMap, handleImageUpload } = useImageBase64Upload({
    maxWidth: 40,
    quality: 0.2,
    field: 'icon',
  });
  const handleSubmit = async () => {
    await upsertInits({
      type: init && init[0]?.type,
      data,
      onSuccess: () => console.log('Update thành công'),
    });
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <Typography variant="h5" mb={3}>
        OUTSOURCES Configuration
      </Typography>
      {init && (
        <Stack spacing={3}>
          {data.map((item, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: '3fr 5fr',
                      md: '4fr 9fr',
                      lg: '1fr 3fr',
                    },
                    gap: 2,
                    alignItems: 'center',
                  }}
                >
                  {/* LEFT - ICON */}
                  <Box>
                    {index === 0 ? (
                      /* TEXT ICON */
                      isAdmin ? (
                        <TextField
                          label="Icon"
                          fullWidth
                          value={item.icon}
                          inputProps={{ maxLength: 15 }}
                          onChange={(e) =>
                            handleChange(index, 'icon', e.target.value)
                          }
                        />
                      ) : (
                        <Typography>{item.icon}</Typography>
                      )
                    ) : /* IMAGE ICON */
                    isAdmin ? (
                      <Box>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Button
                            variant="contained"
                            component="label"
                            sx={{ textTransform: 'none', borderRadius: 2 }}
                          >
                            Choose icon
                            <input
                              type="file"
                              accept="image/*"
                              hidden
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (file.size / 1024 > maxSize) {
                                  alert({ notes });
                                  return;
                                }
                                await handleImageUpload(file, index, setData);
                              }}
                            />
                          </Button>
                          {(previewMap[index] || item.icon) && (
                            <Box
                              component="img"
                              src={previewMap[index] || item.icon}
                              alt="preview"
                              sx={{
                                width: 40,
                                height: 40,
                                objectFit: 'cover',
                                borderRadius: 2,
                                border: '2px solid #ccc',
                              }}
                            />
                          )}
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
                      </Box>
                    ) : (
                      <Box
                        component="img"
                        src={item.icon}
                        alt="preview"
                        sx={{
                          width: 40,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 2,
                          border: '2px solid #ccc',
                        }}
                      />
                    )}
                  </Box>
                  {/* RIGHT - WEB */}
                  <Box>
                    <TextField
                      label="Website URL"
                      fullWidth
                      value={item.web}
                      inputProps={{ maxLength: 255 }}
                      onChange={(e) =>
                        handleChange(index, 'web', e.target.value)
                      }
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
