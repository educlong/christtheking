import { Box, Typography } from '@mui/material';
import { typeMass } from '../Constain';

const ChurchHeader = ({ inits }) => {
  const mass = JSON.parse(inits.find((item) => item.type === typeMass).data)[0];
  const ChurchList = mass
    ? mass.content
        .map((chur) => {
          return `${chur.church} Parish (${chur.city})   •   `;
        })
        .join('')
    : '';
  return (
    mass && (
      <Typography
        variant="span"
        sx={{
          fontWeight: 800,
          letterSpacing: '0.2rem',
          mx: 2,
          lineHeight: 1, // ⭐ BẮT BUỘC nếu muốn chiều cao = chiều cao chữ
          p: 0,
          fontSize: {
            md: '2rem', // tương đương h4
            sm: '1.5rem', // tương đương h5
            xs: '1rem', // tương đương h6
          },
          display: 'inline-block', // ⭐ giúp height cực khớp
        }}
      >
        {ChurchList}
      </Typography>
    )
  );
};
export const ChurchMarquee = ({ inits }) => (
  /* MARQUEE CHUẨN */
  <Box
    sx={{
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
      whiteSpace: 'nowrap',
      display: 'flex', // ⭐ giúp chiều cao match với phần tử bên trong
      alignItems: 'center', // ⭐ luôn canh đúng chiều cao chữ
    }}
  >
    <Box
      sx={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        animation: 'marquee 20s linear infinite',
        '@keyframes marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      }}
    >
      <ChurchHeader inits={inits} />
      <ChurchHeader inits={inits} />
    </Box>
  </Box>
);
