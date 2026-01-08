import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Stack,
  Button,
} from '@mui/material';
import { useUpsertInits } from '../server/InitsHandle';
import { typeFormFiles, typeFormNote } from '../Constain';
import {
  ADConfigsSubmitBtn,
  ADConfigsTitle,
  useImageBase64Upload,
} from './AdminCustomes';

export default function FormConfigs({ inits, isAdmin, maxSize, notes }) {
  const { upsertInits, loading } = useUpsertInits();
  const formNoteInit = useMemo(
    () => [inits.find((item) => item.type === typeFormNote)],
    [inits]
  );
  const formFilesInit = useMemo(
    () => [inits.find((item) => item.type === typeFormFiles)],
    [inits]
  );
  const [formNoteData, setFormNoteData] = useState(() => {
    try {
      return !formNoteInit?.length ? null : formNoteInit[0].data;
    } catch {
      return null;
    }
  });
  const [formFilesData, setFormFilesData] = useState(() => {
    try {
      return !formFilesInit?.length ? [] : JSON.parse(formFilesInit[0].data);
    } catch {
      return [];
    }
  });

  const handleChange = (index, field, value) => {
    setFormFilesData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const { previewMap, handleImageUpload } = useImageBase64Upload({
    maxWidth: 1024,
    quality: 0.2,
    field: 'img',
  });

  const handleSubmit = async () => {
    await upsertInits({
      type: typeFormNote,
      data: formNoteData,
      onSuccess: () => {
        console.log('Form Note updated!');
      },
    });
    await upsertInits({
      type: typeFormFiles,
      data: formFilesData,
      onSuccess: () => {
        console.log('Form Note updated!');
      },
    });
    window.location.reload();
  };
  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 4 }}>
      <Card variant="outlined">
        <CardContent>
          {formNoteInit && <ADConfigsTitle data={formNoteInit[0].type} />}
          <TextField
            label="Message"
            fullWidth
            multiline
            minRows={4}
            value={formNoteData}
            onChange={(e) => setFormNoteData(e.target.value)}
          />
        </CardContent>
      </Card>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        {formFilesInit && <ADConfigsTitle data={formFilesInit[0].type} />}
        {formFilesInit && (
          <Stack spacing={3}>
            {formFilesData.map((item, index) => (
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
                    {/* LEFT - IMAGE ICON */}
                    <Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        {isAdmin ? (
                          <Box>
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
                                    alert(notes);
                                    return;
                                  }
                                  await handleImageUpload(
                                    file,
                                    index,
                                    setFormFilesData
                                  );
                                }}
                              />
                            </Button>
                            {(previewMap[index] || item.img) && (
                              <Box
                                component="img"
                                src={previewMap[index] || item.img}
                                alt="preview"
                                sx={{
                                  width: 60,
                                  height: 60,
                                  objectFit: 'cover',
                                  borderRadius: 2,
                                  border: '2px solid #ccc',
                                }}
                              />
                            )}
                          </Box>
                        ) : (
                          <Box
                            component="img"
                            src={item.img}
                            alt="preview"
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 2,
                              border: '2px solid #ccc',
                            }}
                          />
                        )}
                      </Box>
                      {isAdmin && (
                        <Box
                          sx={{
                            fontSize: 'x-small',
                            fontWeight: 'bold',
                            color: 'red',
                          }}
                        >
                          {notes}
                        </Box>
                      )}
                    </Box>

                    {/* RIGHT - TITLE */}
                    <Box>
                      <TextField
                        label="Title"
                        fullWidth
                        value={item.title}
                        inputProps={{ maxLength: 255 }}
                        onChange={(e) =>
                          handleChange(index, 'title', e.target.value)
                        }
                      />
                      {isAdmin ? (
                        <TextField
                          label="Title"
                          fullWidth
                          value={item.htmlFile}
                          inputProps={{ maxLength: 255 }}
                          onChange={(e) =>
                            handleChange(index, 'title', e.target.value)
                          }
                        />
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, fontStyle: 'italic', color: 'grey' }}
                        >
                          HTML File: {item.htmlFile}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
      <Stack direction="row" justifyContent="center" mt={2}>
        <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
      </Stack>
    </Box>
  );
}
