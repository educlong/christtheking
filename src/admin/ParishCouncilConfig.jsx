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
import {
  ADConfigsSubmitBtn,
  ADConfigsTitle,
  FormConfigSection,
  useImageBase64Upload,
} from './AdminCustomes';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { now, typeParishCouncil } from '../Constain';

export default function ParishCouncilConfig({
  inits,
  isAdmin,
  isMod,
  initTerms,
  initRoles,
  churchData,
}) {
  const listTerms =
    initTerms && initTerms.data && initTerms.data.length > 0
      ? JSON.parse(initTerms.data)
      : [];
  const listRoles =
    initRoles && initRoles.data && initRoles.data.length > 0
      ? JSON.parse(initRoles.data)
      : [];
  const { upsertInits, loading } = useUpsertInits();
  const init = useMemo(
    () => inits.find((i) => i.type === typeParishCouncil),
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
  const [showTermEditor, setShowTermEditor] = useState({});

  useEffect(() => {
    setData(initData);
  }, [initData]);
  /* ===== HANDLERS ===== */
  const handleChange = (index, field, value) => {
    if (field === 'term')
      if (
        !window.confirm(
          'Do you want to change the term? Because you will not be able to enter the other fields of this member if the term is lower.'
        )
      )
        return;
    setData((prev) => {
      const updatedData = prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return updatedData;
    });
  };
  const handleAddParishCouncil = () => {
    // Tìm term có năm kết thúc cao nhất
    const maxTermIndex = listTerms.reduce((maxIndex, term, index) => {
      const [startYear, endYear] = term.split(' - ').map(Number);
      const maxEndYear = listTerms[maxIndex]
        ? listTerms[maxIndex].split(' - ')[1]
        : -Infinity;
      return startYear < maxEndYear && endYear > maxEndYear ? index : maxIndex;
    }, 0); // Mặc định là chỉ số của term đầu tiên (index 0)
    setData((prev) => [
      ...prev,
      {
        img: '',
        name: '',
        parish: 0,
        role: 0,
        phone: '',
        term: maxTermIndex, // Sử dụng chỉ số của term có năm kết thúc cao nhất
      },
    ]);
  };
  const handleDeleteParishCouncil = (index) => {
    if (!window.confirm('Delete this member?')) return;
    setData((prev) => prev.filter((_, i) => i !== index));
  };
  const canEdit = (item) => {
    const currentYear = now.getFullYear();
    // Lấy khoảng năm từ listTerms
    const termRange = listTerms[item.term]; // item.term là chỉ số trong listTerms
    if (!termRange) return false;
    const [startYear, endYear] = termRange.split(' - ').map(Number);
    // Tìm năm kết thúc lớn nhất trong danh sách listTerms
    const maxEndYear = Math.max(
      ...listTerms.map((term) => {
        const [, endYear] = term.split(' - ').map(Number);
        return endYear;
      })
    );
    // Kiểm tra nếu năm kết thúc >= năm hiện tại
    return (
      isAdmin ||
      (isMod &&
        startYear <= currentYear &&
        endYear >= currentYear &&
        endYear >= maxEndYear)
    ); // Mod can edit only if term ends in the current or future year
  };

  /* ===== IMAGE UPLOAD HOOK ===== */
  const { previewMap, handleImageUpload } = useImageBase64Upload({
    maxWidth: 1024,
    quality: 0.1,
    field: 'img',
  });

  const handleSubmit = async () => {
    const currentYear = now.getFullYear();
    // Lọc bỏ ảnh cho các term đã qua
    const payload = data.map((item) => {
      // Lấy khoảng năm từ listTerms
      const termRange = listTerms[item.term]; // item.term là chỉ số trong listTerms
      if (!termRange) return item;
      const [startYear, endYear] = termRange.split(' - ').map(Number);
      // Nếu term đã qua, loại bỏ ảnh
      if (startYear < currentYear && endYear < currentYear) {
        return {
          ...item,
          img: '', // Xóa ảnh nếu term đã hết hạn
        };
      }
      return item; // Không thay đổi đối với các term hiện tại hoặc tương lai
    });
    // Cập nhật dữ liệu lên server
    await upsertInits({
      type: typeParishCouncil,
      data: payload,
      onSuccess: () => console.log('Parish Council updated'),
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
                  {canEdit(item) && (
                    <IconButton
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => handleDeleteParishCouncil(index)}
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
                        <FormConfigSection
                          label={'Role'}
                          list={listRoles}
                          _value={listRoles[item.role] || 'Select...'}
                          handleChange={(e) =>
                            handleChange(
                              index,
                              'role',
                              listRoles.indexOf(e.target.value)
                            )
                          }
                        />
                        {/* )} */}
                        <FormConfigSection
                          label={'Parish'}
                          list={churchData.map((church) => church.church)} // Chỉ truyền mảng tên nhà thờ
                          _value={churchData[item.parish]?.church || ''}
                          handleChange={(e) => {
                            const selectedChurch = e.target.value;
                            const parishIndex = churchData.findIndex(
                              (church) => church.church === selectedChurch
                            );
                            handleChange(
                              index,
                              'parish',
                              parishIndex >= 0 ? parishIndex : 0
                            );
                          }}
                        />
                      </Stack>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                      >
                        {/* {isAdmin && ( */}
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ width: '50%' }}
                          onClick={() =>
                            setShowTermEditor((prev) => ({
                              ...prev,
                              [index]: !prev[index],
                            }))
                          }
                        >
                          Change Term
                        </Button>

                        {showTermEditor[index] && (
                          <FormConfigSection
                            label={'Term'}
                            sx={{ width: '50%' }}
                            list={listTerms}
                            _value={listTerms[item.term] || 'Select...'}
                            handleChange={(e) =>
                              handleChange(
                                index,
                                'term',
                                listTerms.indexOf(e.target.value)
                              )
                            }
                          />
                        )}
                      </Stack>
                      {showTermEditor[index] && (
                        <Typography
                          color="red"
                          sx={{ mt: 2, fontWeight: 'bold' }}
                        >
                          *** The system will take the highest current term. If
                          you change to a lower term, you must fill in the other
                          fields for this member first, because you cannot edit
                          the other fields of this member if the term is a
                          previous one.
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Box>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography>{item.phone}</Typography>
                      <Typography>
                        {listRoles[item.role]} in{' '}
                        {churchData[item.parish].church}
                      </Typography>
                      <Typography>{listTerms[item.term]}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>

      {(isAdmin || isMod) && (
        <Button
          startIcon={<AddIcon />}
          variant="outlined"
          sx={{ mt: 3 }}
          onClick={handleAddParishCouncil}
        >
          Add Member
        </Button>
      )}

      <ADConfigsSubmitBtn handleSubmit={handleSubmit} loading={loading} />
    </Box>
  );
}
