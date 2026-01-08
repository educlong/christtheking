import * as React from 'react';
import {
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  colorMainLetter,
  colorSub8Letter,
  getMenuPaperProps,
  now,
  saveAuth,
  settings,
} from '../Constain';
import { useState, useEffect } from 'react';

export default function UserMenu({ anchorElUser, handleCloseUserMenu }) {
  const [settingCustoms, setSettingCustoms] = useState(settings);
  // Hàm cập nhật settings dựa trên auth
  const updateSettings = () => {
    const auth = JSON.parse(localStorage.getItem(saveAuth));
    const _now = now.getTime();
    let newSettings = [...settings];
    if (auth && _now < auth.expires) {
      // Đăng nhập: xóa Login, thêm Logout nếu chưa có
      newSettings = newSettings.filter((s) => s.name !== settings[0].name);
      if (
        !newSettings.some((s) => s.name === settings[settings.length - 1].name)
      ) {
        newSettings.push({
          name: settings[settings.length - 1].name,
          icon: settings.find(
            (s) => s.name === settings[settings.length - 1].name
          )?.icon,
        });
      }
    } else {
      // Hết hạn hoặc chưa đăng nhập: xóa Logout, thêm Login nếu chưa có
      localStorage.removeItem(saveAuth); // xóa token nếu hết hạn
      newSettings = newSettings.filter(
        (s) => s.name !== settings[settings.length - 1].name
      );
      if (!newSettings.some((s) => s.name === settings[0].name)) {
        const loginIcon = settings.find(
          (s) => s.name === settings[0].name
        )?.icon;
        newSettings.unshift({ name: settings[0].name, icon: loginIcon });
      }
    }
    setSettingCustoms(newSettings);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateSettings();
  }, []); // chỉ chạy 1 lần khi mount
  // Hàm xử lý click menu
  const handleMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting.name === settings[settings.length - 1].name) {
      localStorage.removeItem(saveAuth); // xóa token
      // reload lại trang để cập nhật menu
      window.location.reload();
    }
  };
  return (
    <Menu
      anchorEl={anchorElUser}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorElUser)}
      onClose={handleCloseUserMenu}
      PaperProps={getMenuPaperProps()}
    >
      {settingCustoms.map((setting, index) => (
        <MenuItem
          key={index}
          onClick={() => handleMenuClick(setting)}
          component="a"
          href={
            setting.name !== settings[settings.length - 1].name
              ? `/${setting.name}`
              : '/'
          }
          sx={{
            '&:hover': {
              color: colorSub8Letter, // màu bạn muốn
            },
          }}
        >
          <ListItemIcon>
            <setting.icon sx={{ color: colorMainLetter }} />
          </ListItemIcon>
          <Typography>{setting.name}</Typography>
          {/* Divider sau từng item trừ item cuối */}
          {index < settingCustoms.length - 1 && (
            <Divider sx={{ my: 0.5, opacity: 0.6 }} />
          )}
        </MenuItem>
      ))}
    </Menu>
  );
}
