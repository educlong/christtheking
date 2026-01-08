import { Box, CircularProgress, Typography, Fade } from '@mui/material';

export default function Loading({ text = 'Loading data...' }) {
  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
          color: '#fff',
        }}
      >
        <CircularProgress
          size={70}
          thickness={4}
          sx={{ color: '#90caf9', mb: 3 }}
        />

        <Typography variant="h6" sx={{ letterSpacing: 1, opacity: 0.9 }}>
          {text}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1, opacity: 0.6 }}>
          Please wait a moment
        </Typography>
      </Box>
    </Fade>
  );
}