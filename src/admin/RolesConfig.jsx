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
import { Capitalize } from './DashboardCss';

export default function RolesConfig({
  initRoles,
  rolesData,
  setRolesData,
  isAdmin,
  isMod,
}) {
  // Dropdown chọn role hiện tại
  const [selectedRole, setSelectedRole] = useState(rolesData[0] || '');
  // Thêm role mới
  const [adding, setAdding] = useState(false);
  const [newRole, setNewRole] = useState('');
  const handleAddRole = () => {
    if (!newRole) return;
    setRolesData((prev) => [...prev, newRole]);
    setSelectedRole(newRole);
    setAdding(false);
    setNewRole('');
  };
  const handleDeleteRole = () => {
    setRolesData((prev) => prev.filter((r) => r !== selectedRole));
    setSelectedRole(rolesData.length > 1 ? rolesData[0] : '');
  };
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, m: 0 }}>
      {initRoles && <ADConfigsTitle data={initRoles.type} />}
      <Stack spacing={3}>
        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>{Capitalize(initRoles.type)}</InputLabel>
                <Select
                  value={selectedRole}
                  label={Capitalize(initRoles.type)}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {rolesData.map((r, i) => (
                    <MenuItem key={i} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {isAdmin && selectedRole && (
                <IconButton color="error" onClick={handleDeleteRole}>
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
                Add Role
              </Button>
            )}
            {adding && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  label="Role Name"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  fullWidth
                />
                <Button variant="contained" onClick={handleAddRole}>
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
