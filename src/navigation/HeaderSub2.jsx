import { Box, Button, Typography } from '@mui/material';
import {
  bgColorSub4,
  bgColorSub5,
  colorMainLetter,
  typeRenew,
} from '../Constain';

export const Renewal = ({ inits, posts }) => {
  const renew = JSON.parse(inits.find((item) => item.type === typeRenew).data);
  const latest = inits.reduce((max, item) => {
    return new Date(item.updated_at) > new Date(max.updated_at) ? item : max;
  });
  const time1 = new Date(posts[0].time);
  const time2 = new Date(latest.updated_at);
  const latestTime = time1 > time2 ? time1 : time2;
  return !renew ? null : (
    <>
      <Typography
        variant="span"
        sx={{ mx: 0.5, fontSize: { xs: 'small', sm: 'medium' } }}
      >
        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
          Last update:{' '}
        </Box>
        {latestTime.toDateString()}
      </Typography>
      <Box
        sx={{
          display: 'flex', // hiển thị flex, nằm 1 dòng
          alignItems: 'center', // căn giữa theo chiều cao
          gap: 1, // khoảng cách giữa Button và hình
        }}
      >
        <Button
          component="a"
          href={renew[0].web}
          target="_blank"
          rel="noopener noreferrer" // bảo mật khi mở tab mới
          sx={[
            RenewalStyles('flex', 0.5),
            {
              fontWeight: 'bold',
              color: colorMainLetter,
              backgroundColor: bgColorSub4,
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: bgColorSub5,
                color: colorMainLetter, // ⭐ không đổi màu chữ khi nhấn
                opacity: 0.9,
              },
              '&:active': {
                color: colorMainLetter, // ⭐ không đổi màu chữ khi nhấn
                textDecoration: 'none', // ⭐ bỏ gạch chân khi nhấn
              },
              '&:focus': {
                color: colorMainLetter,
                textDecoration: 'none',
                outline: 'none', // ⭐ bỏ viền focus mặc định
              },
            },
          ]}
        >
          {renew[0].icon}
        </Button>
        {renew.map((r, idx) => {
          const nextIdx = idx + 1; // bắt đầu từ 1
          return nextIdx > renew.length - 1 ? null : (
            <RenewalVatican
              key={nextIdx}
              web={renew[nextIdx].web}
              icon={renew[nextIdx].icon}
            />
          );
        })}
      </Box>
    </>
  );
};

const RenewalStyles = (d, p) => ({
  display: d,
  textDecoration: 'none',
  borderRadius: '12px',
  border: 'solid 2px white',
  px: { xs: 0.5, sm: 1 },
  py: p,
});
const RenewalVatican = ({ web, icon }) => (
  <Box
    component="a"
    href={web}
    target="_blank"
    rel="noopener noreferrer"
    sx={[
      RenewalStyles('inline-block', 0.2),
      {
        width: 'auto',
        height: 'auto',
        '&:hover': {
          opacity: 0.8, // hover nhẹ
          cursor: 'pointer',
        },
      },
    ]}
  >
    <Box
      component="img"
      src={icon}
      alt="Vatican"
      sx={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  </Box>
);
