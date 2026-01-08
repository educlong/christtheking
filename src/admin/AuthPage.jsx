import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  alarmEmailEmpty,
  alarmLoginByGoogle,
  alarmWrongLogin,
  backgroundImageLoginRegister,
  displayxsmd,
  LoginRegister,
  now,
  saveAuth,
  settings,
  typeAuth,
} from '../Constain';
import { useNavigate } from 'react-router-dom';
import { useFetchInit } from '../server/InitsHandle';

export default function AuthPage() {
  const { init: authUsersInit } = useFetchInit(typeAuth);
  const authUsers =
    authUsersInit.length > 0 ? JSON.parse(authUsersInit[0].data) : '';
  const [tab, setTab] = useState(0);
  const handleChange = (e, newValue) => setTab(newValue);
  const [usn, setUsn] = useState('');
  const [pwd, setPwd] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const handleLogin = (showAuth3) => {
    const user =
      authUsers && authUsers.find((u) => u.usn === usn && u.pwd === pwd);
    if (!user) {
      alert(alarmWrongLogin);
      return;
    }
    // Lưu thông tin đăng nhập vào localStorage
    const expiration = now.getTime() + 24 * 60 * 60 * 1000; // 1 ngày
    localStorage.setItem(
      saveAuth,
      JSON.stringify({
        usn: user.usn,
        auth: user.auth,
        expires: expiration,
      })
    );
    // điều hướng dựa trên quyền
    navigate(showAuth3 ? '/' : `/${settings[settings.length - 2].name}`);
    window.location.reload();
  };
  // --------- HANDLERS YOU CAN CONNECT TO BACKEND ----------
  const handleRegister = () => {
    if (email === '') alert(alarmEmailEmpty);
  };
  const handleGoogleRegister = () => {
    alert(alarmLoginByGoogle);
  };
  // --------------------------------------------------------
  const setFields = { handleGoogleRegister, setUsn, setPwd, setEmail };
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        // background: 'linear-gradient(135deg, #4e73df, #1cc7d0)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: 'auto',
          height: 520,
          display: 'flex',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        {/* LEFT SIDE IMAGE */}
        <Box
          sx={{
            width: '50%',
            backgroundImage: `url('${backgroundImageLoginRegister}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: displayxsmd,
          }}
        ></Box>
        {/* RIGHT SIDE CONTENT */}
        <Box
          sx={{
            width: '100%',
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Tabs value={tab} onChange={handleChange} centered>
            <Tab label={settings[0].name} sx={{ fontWeight: 'bold' }} />
            {/* <Tab label="Register" sx={{ fontWeight: 'bold' }} /> */}
          </Tabs>
          {/* REGISTER FORM */}
          {tab === 1 && (
            <LoginRegisterForms
              loginRegister={LoginRegister.register}
              handleLoginRegister={handleRegister}
              showWelcome={true}
              showAuth3={true}
              {...setFields}
            />
          )}
          {/* LOGIN FORM (giữ nguyên) */}
          {tab === 0 && (
            <LoginRegisterForms
              loginRegister={LoginRegister.login}
              handleLoginRegister={handleLogin}
              showWelcome={true}
              showAuth3={false}
              {...setFields}
            />
          )}
        </Box>
      </Paper>
    </Box>
  );
}
const LoginRegisterForms = ({
  handleGoogleRegister,
  loginRegister,
  handleLoginRegister,
  showWelcome,
  showAuth3,
  setName,
  setPwd,
  setUsn,
  setEmail,
}) => (
  <Box sx={{ mt: 4 }}>
    {showWelcome ? (
      <Typography variant="h5" fontWeight="bold" mb={2}>
        {loginRegister.welcome}
      </Typography>
    ) : null}
    {/* GOOGLE BUTTON */}
    {showAuth3 ? (
      <>
        {LoginRegister.register.with.map((w, idx) => (
          <Button
            key={`${idx}-${w.auth3}`}
            fullWidth
            variant="outlined"
            startIcon={React.createElement(w.icon)}
            onClick={handleGoogleRegister}
            sx={{
              paddingY: 1,
              borderColor: '#888',
              color: '#444',
              fontWeight: 'bold',
              mb: 2,
              '&:hover': {
                borderColor: '#555',
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            {w.auth3}
          </Button>
        ))}
        <Divider sx={{ my: 2 }}>or</Divider>
      </>
    ) : null}
    {/* FORM INPUTS */}
    <LoginRegisterForm
      loginRegister={loginRegister}
      handleLoginRegister={handleLoginRegister}
      showAuth3={showAuth3}
      setName={setName}
      setPwd={setPwd}
      setUsn={setUsn}
      setEmail={setEmail}
    />
  </Box>
);
const LoginRegisterForm = ({
  loginRegister,
  handleLoginRegister,
  showAuth3,
  setPwd,
  setUsn,
  setEmail,
}) => {
  const nameMap = {
    username: setUsn,
    password: setPwd,
    email: setEmail,
  };
  return (
    <>
      {loginRegister.typing.map((type, idx) => (
        <TypeLoginRegister
          key={`${idx}-${type.name}`}
          name={type.name}
          Icon={type.icon}
          setName={nameMap[type.name.toLowerCase()]}
        />
      ))}
      <BtnLoginRegister
        handleLoginRegister={handleLoginRegister}
        btnName={loginRegister.btn}
        showAuth3={showAuth3}
      />
    </>
  );
};
const BtnLoginRegister = ({ handleLoginRegister, btnName, showAuth3 }) => (
  <Button
    fullWidth
    variant="contained"
    size="large"
    onClick={() => handleLoginRegister(showAuth3)} // <- truyền showAuth3
    sx={{
      paddingY: 1.2,
      fontSize: '16px',
      background: 'linear-gradient(90deg, #4e73df, #1cc7d0)',
    }}
  >
    {btnName}
  </Button>
);
const TypeLoginRegister = ({ name, Icon, setName }) => (
  <TextField
    fullWidth
    label={name}
    variant="outlined"
    type={name.toLowerCase() === 'password' ? 'password' : 'text'}
    sx={{ mb: 2 }}
    onChange={(e) => setName(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">{Icon && <Icon />}</InputAdornment>
      ),
    }}
  />
);
