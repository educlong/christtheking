import React, { useEffect, useMemo, useState } from 'react';
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
import { useUpsertInits } from '../server/InitsHandle';
import { now, rolesPastor, typePastors } from '../Constain';
import {
  ADConfigsSubmitBtn,
  ADConfigsTitle,
  FormConfigSection,
  useImageBase64Upload,
} from './AdminCustomes';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PastorsConfig({ inits, isAdmin, isMod }) {
  const { upsertInits, loading } = useUpsertInits();
  const init = useMemo(
    () => inits.find((i) => i.type === typePastors),
    [inits]
  );
  const initData = useMemo(() => {
    try {
      return init ? JSON.parse(init.data) : [];
    } catch {
      return [];
    }
  }, [init]);
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(initData);
  }, [initData]);
  /* ===== HANDLERS ===== */
  const handleChange = (index, field, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const handleAddPastor = () => {
    if (
      !window.confirm(
        'Has the current priest already been transferred? Are you sure the parish has a new priest yet?'
      )
    )
      return;
    setData((prev) => {
      const updated = prev.map((p) =>
        p.yearEnd === null ? { ...p, yearEnd: now.getFullYear() } : p
      );

      return [
        ...updated,
        {
          img: '',
          name: '',
          role: rolesPastor[1],
          yearStart: now.getFullYear(),
          yearEnd: null, // pastor mới là đương nhiệm
          phone: '',
          details: '',
        },
      ];
    });
  };
  const handleDeletePastor = (index) => {
    if (!window.confirm('Delete this pastor?')) return;
    setData((prev) => prev.filter((_, i) => i !== index));
  };
  const canEdit = (item) => isAdmin || (isMod && !item.yearEnd);
  /* ===== IMAGE UPLOAD HOOK ===== */
  const { previewMap, handleImageUpload } = useImageBase64Upload({
    maxWidth: 1024,
    quality: 0.1,
    field: 'img',
  });
  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    const payload = data.map((p) => ({
      ...p,
      yearStart: p.yearStart ? Number(p.yearStart) : null,
      yearEnd: p.yearEnd ? Number(p.yearEnd) : null,
    }));
    await upsertInits({
      type: typePastors,
      data: payload,
      onSuccess: () => console.log('Pastors updated'),
    });
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      {init && <ADConfigsTitle data={init.type} />}
      <Stack spacing={3}>
        {data.map((item, index) => {
          return (
            <Card key={index} variant="outlined">
              <CardContent>
                <Stack spacing={2} position={'relative'}>
                  {/* DELETE */}
                  {(isAdmin ||
                    (isMod &&
                      (index === data.length - 1 ||
                        index === data.length - 2))) && (
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeletePastor(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  {/* IMAGE */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    {item.img && (
                      <Box
                        component="img"
                        src={previewMap[index] || item.img}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 2,
                          objectFit: 'cover',
                          border: '1px solid #ccc',
                        }}
                      />
                    )}

                    {canEdit(item) && (
                      <Button component="label" variant="contained">
                        Upload Photo
                        <input
                          hidden
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e.target.files[0], index, setData)
                          }
                        />
                      </Button>
                    )}
                  </Stack>
                  {canEdit(item) ? (
                    <>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        {/* NAME */}
                        <TextField
                          label="Name"
                          fullWidth
                          value={item.name}
                          onChange={(e) =>
                            handleChange(index, 'name', e.target.value)
                          }
                        />
                        {/* PHONE */}
                        <TextField
                          label="Phone"
                          value={item.phone}
                          onChange={(e) =>
                            handleChange(index, 'phone', e.target.value)
                          }
                        />
                      </Stack>

                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        {/* ROLE */}
                        <FormConfigSection
                          label={'Role'}
                          list={rolesPastor}
                          _value={item.role}
                          handleChange={(e) =>
                            handleChange(index, 'role', e.target.value)
                          }
                        />
                        {/* YEARS */}
                        <TextField
                          label="Year Start"
                          type="number"
                          value={item.yearStart || ''}
                          onChange={(e) =>
                            handleChange(
                              index,
                              'yearStart',
                              e.target.value ? e.target.value : null
                            )
                          }
                          fullWidth
                        />
                        {isAdmin && (
                          <TextField
                            label="Year End"
                            type="number"
                            fullWidth
                            value={item.yearEnd ?? ''}
                            onChange={(e) =>
                              handleChange(
                                index,
                                'yearEnd',
                                e.target.value === '' ? null : e.target.value
                              )
                            }
                            helperText={
                              !item.yearEnd ? 'Leave empty if current' : ''
                            }
                          />
                        )}
                      </Stack>
                      {/* DETAILS */}
                      <TextField
                        label="Details"
                        multiline
                        minRows={3}
                        value={item.details}
                        onChange={(e) =>
                          handleChange(index, 'details', e.target.value)
                        }
                      />
                    </>
                  ) : (
                    <Box>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography>{item.role}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: item.yearEnd ? 'text.secondary' : 'green',
                          fontWeight: 'bold',
                        }}
                      >
                        {item.yearStart} -{' '}
                        {item.yearEnd ? `${item.yearEnd}` : 'Current Pastor'}
                      </Typography>
                      <Typography>{item.phone}</Typography>
                      <Typography>{item.details}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
      {(isAdmin || isMod) && (
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{ mt: 3, width: { xs: '100%', md: '80%', lg: '50%' } }}
            onClick={handleAddPastor}
          >
            Add Pastor
          </Button>
          <Typography color="red" sx={{ mt: 2, fontWeight: 'bold' }}>
            *Do not click **ADD PASTOR** if the current pastor is still serving
            as the parish pastor.
          </Typography>
        </Stack>
      )}
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
