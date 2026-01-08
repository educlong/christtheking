import React, { useMemo, useState } from 'react';
import OpenInFullSharpIcon from '@mui/icons-material/OpenInFullSharp';
import CloseFullscreenSharpIcon from '@mui/icons-material/CloseFullscreenSharp';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { maritalOptions, typeParishers } from '../Constain';
import { useUpsertInits } from '../server/InitsHandle';
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ADConfigsSubmitBtn } from './AdminCustomes';

export default function ParishersConfig({
  isAdmin,
  isMod,
  church,
  parishersData,
}) {
  const { upsertInits, loading } = useUpsertInits();
  const [data, setData] = useState([]);
  const [headTable, setHeadTable] = useState([]);
  const [isShrink, setIsShrink] = useState(false);
  useEffect(() => {
    if (parishersData?.listparishers) setData(parishersData.listparishers);
    if (parishersData?.headTable) setHeadTable(parishersData.headTable);
  }, [parishersData]);
  const churchOptions = useMemo(() => church.map((c) => c.church), [church]);
  // NEW: state to track which row is in edit mode
  const [editingIndex, setEditingIndex] = useState(null);
  const toggleEdit = (index) => {
    setEditingIndex((prev) => (prev === index ? null : index));
  };
  const handleCellChange = (rowIndex, fieldName, value) => {
    setData((prev) =>
      prev.map((item, idx) =>
        idx === rowIndex ? { ...item, [fieldName]: value } : item
      )
    );
  };
  const emptyParisher = () => ({
    id: `${Date.now()}-${uuidv4()}`,
    fullname: '',
    parish: '',
    dob: '',
    baptism: '',
    communion: '',
    confirmation: '',
    maritalstatus: '',
    maritalday: '',
    address: '',
    phone: '',
    email: '',
    noenvelops: '',
    whostax: '',
    is_delete: 0,
  });

  const handleAddParisher = () => {
    setData((prev) => {
      const next = [...prev, emptyParisher()];
      setEditingIndex(next.length - 1);
      return next;
    });
  };
  const handleDeleteParisher = (index) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this parisher?'
    );
    if (!confirmDelete) return;
    setData((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, is_delete: 1 } : item
      )
    );
    // nếu đang edit dòng này → thoát edit
    setEditingIndex((prev) => (prev === index ? null : prev));
  };
  /* ===== SUBMIT ===== */
  const isNumeric = (v) => v !== null && v !== '' && !isNaN(v);
  const handleSubmit = async () => {
    const sortedData = [...data].sort((a, b) => {
      const aNum = isNumeric(a.noenvelops);
      const bNum = isNumeric(b.noenvelops);
      // 1️⃣ số luôn lên trước chữ
      if (aNum && !bNum) return -1;
      if (!aNum && bNum) return 1;
      // 2️⃣ cả hai đều là số
      if (aNum && bNum) {
        const diff = Number(a.noenvelops) - Number(b.noenvelops);
        if (diff !== 0) return diff;
      }
      // 3️⃣ cả hai đều là chữ → so sánh alphabet
      if (!aNum && !bNum) {
        const diff = String(a.noenvelops || '').localeCompare(
          String(b.noenvelops || '')
        );
        if (diff !== 0) return diff;
      }
      // 4️⃣ fallback: fullname
      return (a.fullname || '').localeCompare(b.fullname || '');
    });
    await upsertInits({
      type: typeParishers,
      data: { listparishers: sortedData, headTable },
      onSuccess: () => console.log('Parishers updated'),
    });
    window.location.reload();
  };
  //   useEffect(() => {
  //     console.log('Data changed:', data);
  //   }, [data]);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 2, width: '100%' }}>
        <Button
          sx={{ width: '100%' }}
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddParisher}
        >
          Add Parisher
        </Button>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setIsShrink((prev) => !prev)}
          startIcon={
            isShrink ? <OpenInFullSharpIcon /> : <CloseFullscreenSharpIcon />
          }
        >
          {isShrink ? 'Extend' : 'Shrink'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={isShrink ? { width: isAdmin ? 3300 : 3000 } : undefined}>
          <TableHead sx={{ bgcolor: '#999aa3' }}>
            <TableRow>
              {headTable &&
                headTable.length > 0 &&
                headTable.map((h, idx) => {
                  const isEdge = idx === 0 || idx === headTable.length - 1;
                  if (isEdge && !isAdmin) return null;
                  return (
                    idx !== 0 && <TableCell key={`${idx}-${h}`}>{h}</TableCell>
                  );
                })}
              {(isAdmin || isMod) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data &&
              data.length > 0 &&
              data.map((p, index) => {
                const isEditing = editingIndex === index;
                return isMod && p.is_delete === 1 ? null : (
                  <TableRow
                    key={`${p.id}-${index}`}
                    sx={{
                      bgcolor:
                        p.is_delete === 1
                          ? '#fda1a1'
                          : index % 2 === 0
                          ? 'white'
                          : '#fff2d9',
                    }}
                  >
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.fullname}
                      onChange={(val) =>
                        handleCellChange(index, 'fullname', val)
                      }
                    />
                    <TableCellSelect
                      isEditing={isEditing}
                      arr={churchOptions}
                      value={p.parish}
                      onChange={(val) => handleCellChange(index, 'parish', val)}
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.dob}
                      onChange={(val) => handleCellChange(index, 'dob', val)}
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.baptism}
                      onChange={(val) =>
                        handleCellChange(index, 'baptism', val)
                      }
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.communion}
                      onChange={(val) =>
                        handleCellChange(index, 'communion', val)
                      }
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.confirmation}
                      onChange={(val) =>
                        handleCellChange(index, 'confirmation', val)
                      }
                    />
                    <TableCellSelect
                      isEditing={isEditing}
                      arr={maritalOptions}
                      value={p.maritalstatus}
                      onChange={(val) =>
                        handleCellChange(index, 'maritalstatus', val)
                      }
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.maritalday}
                      onChange={(val) =>
                        handleCellChange(index, 'maritalday', val)
                      }
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.address}
                      onChange={(val) =>
                        handleCellChange(index, 'address', val)
                      }
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.phone}
                      onChange={(val) => handleCellChange(index, 'phone', val)}
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.email}
                      onChange={(val) => handleCellChange(index, 'email', val)}
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.noenvelops}
                      onChange={(val) =>
                        handleCellChange(index, 'noenvelops', val)
                      }
                    />
                    <TableCellEdit
                      isEditing={isEditing}
                      value={p.whostax}
                      onChange={(val) =>
                        handleCellChange(index, 'whostax', val)
                      }
                    />
                    {isAdmin && (
                      <TableCellEdit
                        isEditing={isEditing}
                        value={p.is_delete}
                        onChange={(val) =>
                          handleCellChange(index, 'is_delete', val)
                        }
                      />
                    )}
                    {(isAdmin || isMod) && (
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => toggleEdit(index)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteParisher(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <ADConfigsSubmitBtn
        handleSubmit={handleSubmit}
        loading={loading}
        _100percent="100%"
      />
    </Box>
  );
}
const TableCellEdit = ({ isEditing, value, onChange }) => (
  <TableCell>
    {isEditing ? (
      <TextField
        value={value ?? ''}
        variant="standard"
        fullWidth
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      value
    )}
  </TableCell>
);
const TableCellSelect = ({ isEditing, arr = [], value, onChange }) => (
  <TableCell>
    {isEditing ? (
      <Select
        value={value ?? ''}
        variant="standard"
        fullWidth
        onChange={(e) => onChange(e.target.value)}
      >
        {arr.map((a) => (
          <MenuItem key={a} value={a}>
            {a}
          </MenuItem>
        ))}
      </Select>
    ) : (
      value
    )}
  </TableCell>
);
