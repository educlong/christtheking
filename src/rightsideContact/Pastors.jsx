import { Box, Grid, Typography } from '@mui/material';
import PostCard from '../rightsideCard/PostCard';
import { displaysm, typeFirstBible, typePastors } from '../Constain';
import pastor from '../assets/pastor.jpg';

export const Pastors = ({ inits }) => {
  const firstBible = inits.find((item) => item.type === typeFirstBible).data;
  const pastors = JSON.parse(
    inits.find((item) => item.type === typePastors).data
  );
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { md: '1fr 3fr', xs: '1fr' },
        gap: 2,
        mb: 1,
      }}
    >
      {pastors &&
        pastors.length > 0 &&
        pastors.map((p, i) =>
          p.yearEnd !== null ? null : (
            <Box key={i} display={displaysm}>
              <Pastor showInfo={false} pas={p} />
            </Box>
          )
        )}
      <Box alignItems={'center'} display={'flex'}>
        {firstBible && <PostCard content={firstBible} />}
      </Box>
    </Box>
  );
};

export default function Pastor({ showInfo, pas }) {
  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={6} md={4} textAlign="center">
        <Box
          component="img"
          src={pas.img ? pas.img : pastor}
          alt={pas.name}
          sx={{
            width: 220,
            height: 260,
            objectFit: 'cover',
            border: '1px solid white',
            p: 1,
            borderRadius: 2,
            boxShadow: 3,
            mb: 1,
          }}
        />
        <Typography fontWeight="600">{pas.name}</Typography>
        <Typography display={{ xs: 'block', sm: showInfo ? 'block' : 'none' }}>
          {pas.role}
        </Typography>
        <Typography display={{ xs: 'block', sm: showInfo ? 'block' : 'none' }}>
          {`${pas.yearStart} - ${pas.yearEnd ?? ''}`}
        </Typography>
        {pas.yearEnd ? null : (
          <Typography
            display={{ xs: 'block', sm: showInfo ? 'block' : 'none' }}
          >
            {pas.phone}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}
