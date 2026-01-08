import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useUpsertInits } from '../server/InitsHandle';
import { ADConfigsSubmitBtn, ADConfigsTitle } from './AdminCustomes';
import { typePages } from '../Constain';

export default function MenuForm({ isAdmin, pagesData }) {
  const { upsertInits, loading } = useUpsertInits();
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(pagesData);
  }, [pagesData]);

  const handleMainChange = (index, value) => {
    setData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, main: value } : item))
    );
  };

  const handleSubChange = (mainIndex, subIndex, value) => {
    setData((prev) =>
      prev.map((item, i) =>
        i === mainIndex
          ? {
              ...item,
              sub: item.sub.map((s, j) => (j === subIndex ? value : s)),
            }
          : item
      )
    );
  };

  const handleDeleteSub = (mainIndex, subIndex) => {
    if (
      !window.confirm(
        'If you delete this page, all posts in this page will be deleted. Delete this page?'
      )
    )
      return;
    setData((prev) =>
      prev.map((item, i) =>
        i === mainIndex
          ? {
              ...item,
              sub: item.sub.filter((_, idx) => idx !== subIndex),
            }
          : item
      )
    );
  };
  const handleAddSub = (mainIndex) => {
    setData((prev) =>
      prev.map((item, i) =>
        i === mainIndex ? { ...item, sub: [...item.sub, ''] } : item
      )
    );
  };

  const handleSubmit = async () => {
    await upsertInits({
      type: typePages,
      data,
      onSuccess: () => console.log('Upsert thành công!'),
    });
    window.location.reload();
  };
  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      <ADConfigsTitle data={typePages} />
      {pagesData && (
        <Stack spacing={3}>
          {data.map((item, mainIndex) => {
            const canEditSubFully = item.main === 'Groups';
            return (
              <Card key={mainIndex} variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr', // mobile: 1 cột
                        sm: '3fr 5fr', // tablet: cột trái 3, cột phải 5
                        md: '4fr 9fr', // desktop: cột trái 4, cột phải 9
                        lg: '1fr 3fr', // lớn hơn: cột trái 1, cột phải 3
                      },
                      gap: 2, // khoảng cách giữa cột
                    }}
                  >
                    {/* Cột LEFT - MAIN */}
                    {isAdmin ? (
                      <Box>
                        <TextField
                          label="Main Title"
                          fullWidth
                          value={item.main}
                          onChange={(e) =>
                            handleMainChange(mainIndex, e.target.value)
                          }
                        />
                      </Box>
                    ) : (
                      <Typography>{item.main}</Typography>
                    )}

                    {/* Cột RIGHT - SUB */}
                    <Box>
                      <Stack spacing={1}>
                        {item.sub.map((subItem, subIndex) => (
                          <Box
                            key={subIndex}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              width: '100%',
                            }}
                          >
                            {!isAdmin &&
                            (mainIndex === data.length - 1 ||
                              mainIndex === 0) ? (
                              <Typography>{subItem}</Typography>
                            ) : (
                              <TextField
                                label={`Sub ${subIndex + 1}`}
                                fullWidth
                                value={subItem}
                                onChange={(e) =>
                                  handleSubChange(
                                    mainIndex,
                                    subIndex,
                                    e.target.value
                                  )
                                }
                                inputProps={{ maxLength: 25 }} // Giới hạn 20 ký tự
                              />
                            )}
                            {canEditSubFully && (
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleDeleteSub(mainIndex, subIndex)
                                }
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Stack>

                      {canEditSubFully && (
                        <Button
                          startIcon={<AddIcon />}
                          sx={{ mt: 2 }}
                          onClick={() => handleAddSub(mainIndex)}
                        >
                          Add Sub Item
                        </Button>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}
      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
