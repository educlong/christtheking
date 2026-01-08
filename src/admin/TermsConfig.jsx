import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { ADConfigsTitle } from './AdminCustomes';
import { now } from '../Constain';
import { Capitalize } from './DashboardCss';

export default function TermsConfig({
  initTerms,
  termsData,
  setTermsData,
  isAdmin,
  isMod,
}) {
  const terms = termsData; // dùng state từ cha
  const setTerms = setTermsData;
  const currentYear = now.getFullYear();
  // Dropdown chọn term hiện tại
  const [selectedTerm, setSelectedTerm] = useState(
    terms.find((t) => {
      const [start, end] = t.split(' - ').map(Number);
      return currentYear >= start && currentYear <= end;
    }) ||
      terms[0] ||
      ''
  );
  // Thêm term mới
  const [adding, setAdding] = useState(false);
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const handleAddTerm = () => {
    if (!newStart || !newEnd) return;
    const newTerm = `${newStart} - ${newEnd}`;
    setTerms((prev) => [...prev, newTerm]);
    setSelectedTerm(newTerm);
    setAdding(false);
    setNewStart('');
    setNewEnd('');
  };
  const handleDeleteTerm = () => {
    setTerms((prev) => prev.filter((t) => t !== selectedTerm));
    setSelectedTerm(terms.length > 1 ? terms[0] : '');
  };
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, m: 0 }}>
      {initTerms && <ADConfigsTitle data={initTerms.type} />}
      <Stack spacing={3}>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>{Capitalize(initTerms.type)}</InputLabel>
                <Select
                  value={selectedTerm}
                  label={Capitalize(initTerms.type)}
                  onChange={(e) => setSelectedTerm(e.target.value)}
                >
                  {terms.map((t, i) => (
                    <MenuItem key={i} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {isAdmin && selectedTerm && (
                <IconButton color="error" onClick={handleDeleteTerm}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>

            {(isAdmin || isMod) && !adding && (
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setAdding(true)}
              >
                Add Term
              </Button>
            )}

            {adding && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Start Year"
                  type="number"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="End Year"
                  type="number"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={handleAddTerm}>
                  Confirm Add
                </Button>
                <Button variant="text" onClick={() => setAdding(false)}>
                  Cancel
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
