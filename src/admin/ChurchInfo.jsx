import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  Divider,
  Grid,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useUpsertInits } from '../server/InitsHandle';
import { ADConfigsSubmitBtn, ADConfigsTitle } from './AdminCustomes';

export default function ChurchInfo({
  isAdmin,
  isMod,
  massInit,
  emailsParishers,
}) {
  const { upsertInits, loading } = useUpsertInits();
  /* ---------------- Parse DATA ---------------- */
  const parsedData = useMemo(() => {
    if (!massInit?.length) return [];
    try {
      return JSON.parse(massInit[0].data);
    } catch {
      return [];
    }
  }, [massInit]);
  const massBlock = massInit && parsedData?.[0];
  const daysBlock = massInit && parsedData?.[1];
  const hoursBlock = massInit && parsedData?.[2];
  const [churches, setChurches] = useState(() => massBlock?.content || []);
  useEffect(() => {
    if (massBlock?.content) {
      setChurches(massBlock.content);
    }
  }, [massBlock]);

  /* ---------------- Handlers ---------------- */
  const handleChurchChange = (i, field, value) => {
    setChurches((prev) =>
      prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c))
    );
  };

  const handleTimeChange = (cIndex, tIndex, field, value) => {
    setChurches((prev) =>
      prev.map((c, i) =>
        i === cIndex
          ? {
              ...c,
              time: c.time.map((t, j) =>
                j === tIndex ? { ...t, [field]: value } : t
              ),
            }
          : c
      )
    );
  };

  const handleAddChurch = () => {
    setChurches((prev) => [
      ...prev,
      {
        church: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        phone: '',
        email: '',
        time: [],
      },
    ]);
  };

  const handleDeleteChurch = (i) => {
    if (!window.confirm('Delete this church?')) return;
    setChurches((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleAddTime = (i) => {
    setChurches((prev) =>
      prev.map((c, idx) =>
        idx === i
          ? {
              ...c,
              time: [...c.time, { day: '', mass: '', note: '' }],
            }
          : c
      )
    );
  };

  const handleDeleteTime = (cIndex, tIndex) => {
    if (!window.confirm('Delete this mass?')) return;
    setChurches((prev) =>
      prev.map((c, i) =>
        i === cIndex ? { ...c, time: c.time.filter((_, j) => j !== tIndex) } : c
      )
    );
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    const payload = [
      { ...massBlock, content: churches },
      daysBlock,
      hoursBlock,
    ];
    await upsertInits({
      type: massInit[0]?.type,
      data: payload,
      onSuccess: () => console.log('Upsert thành công'),
    });

    window.location.reload();
  };

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {massBlock && <ADConfigsTitle data={massBlock.name} />}

      <Stack spacing={3}>
        {churches.map((church, cIndex) => (
          <Card key={cIndex} variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                {/* -------- Church Info -------- */}
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    {[
                      'church',
                      'address',
                      'city',
                      'state',
                      'postalCode',
                      'phone',
                      'email',
                    ].map((field) =>
                      isAdmin ||
                      (isMod && (field === 'email' || field === 'phone')) ? (
                        <TextField
                          key={field}
                          label={field.toUpperCase()}
                          value={church[field]}
                          onChange={(e) =>
                            handleChurchChange(cIndex, field, e.target.value)
                          }
                          fullWidth
                        />
                      ) : (
                        <Typography key={field}>
                          <strong>{field.toUpperCase()}:</strong>{' '}
                          {church[field]}
                        </Typography>
                      )
                    )}
                  </Stack>
                </Grid>

                {/* -------- Mass Times -------- */}
                <Grid item xs={12} md={6}>
                  {massBlock && (
                    <Typography variant="subtitle1">
                      {massBlock.name}
                    </Typography>
                  )}
                  <Divider sx={{ mb: 1 }} />

                  <Stack spacing={1}>
                    {church.time.map((t, tIndex) => (
                      <Box
                        key={tIndex}
                        sx={{ display: 'flex', gap: 1, alignItems: 'center' }}
                      >
                        <TextField
                          select
                          label="Day"
                          value={t.day}
                          onChange={(e) =>
                            handleTimeChange(
                              cIndex,
                              tIndex,
                              'day',
                              e.target.value
                            )
                          }
                          sx={{ minWidth: 120 }}
                        >
                          {daysBlock?.content.map((d) => (
                            <MenuItem key={d} value={d}>
                              {d}
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          select
                          label="Time"
                          value={t.mass}
                          onChange={(e) =>
                            handleTimeChange(
                              cIndex,
                              tIndex,
                              'mass',
                              e.target.value
                            )
                          }
                          sx={{ minWidth: 120 }}
                        >
                          {hoursBlock?.content.map((h) => (
                            <MenuItem key={h} value={h}>
                              {h}
                            </MenuItem>
                          ))}
                        </TextField>

                        <TextField
                          label="Note"
                          value={t.note}
                          onChange={(e) =>
                            handleTimeChange(
                              cIndex,
                              tIndex,
                              'note',
                              e.target.value
                            )
                          }
                        />

                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTime(cIndex, tIndex)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>

                  <Button
                    startIcon={<AddIcon />}
                    sx={{ mt: 1 }}
                    onClick={() => handleAddTime(cIndex)}
                  >
                    Add Mass Time
                  </Button>
                </Grid>
              </Grid>

              {isAdmin && (
                <Box mt={2} textAlign="right">
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeleteChurch(cIndex)}
                  >
                    Delete Church
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

      {isAdmin && (
        <Box mt={3}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleAddChurch}
          >
            Add Church
          </Button>
        </Box>
      )}
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
