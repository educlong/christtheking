import { Box, Grid } from '@mui/material';
import Pastor from './Pastors';
import { CommitteeTable } from './Committee';
import { SectionLeft } from '../leftside/anounceSub';
import {
  typeMass,
  typePages,
  typeParishCouncil,
  typePastors,
} from '../Constain';

export default function MemoryBook({ inits }) {
  const pages = JSON.parse(inits.find((item) => item.type === typePages).data);
  const mass = JSON.parse(inits.find((item) => item.type === typeMass).data)[0];
  const pastors = JSON.parse(
    inits.find((item) => item.type === typePastors).data
  );
  const parishCouncil = JSON.parse(
    inits.find((item) => item.type === typeParishCouncil).data
  );
  // Group theo parish
  const parishMap = {};
  parishCouncil &&
    parishCouncil.length > 0 &&
    parishCouncil.forEach((p) => {
      if (!parishMap[p.parish]) parishMap[p.parish] = [];
      parishMap[p.parish].push(p);
    });
  // Sort mỗi nhóm theo term → role
  parishCouncil &&
    parishCouncil.length > 0 &&
    Object.keys(parishMap).forEach((key) => {
      parishMap[key].sort((a, b) => {
        if (a.term !== b.term) return a.term - b.term; // sort theo term trước
        return a.role - b.role; // nếu term bằng nhau → sort theo role
      });
    });
  const sortedPastors =
    pastors &&
    pastors.length > 0 &&
    pastors.slice().sort((a, b) => a.yearStart - b.yearStart);
  // ===============================
  // PAGE UI
  // ===============================
  return (
    <Box display="block">
      {pages && pages.length > 0 && (
        <SectionLeft body={`${pages[pages.length - 1].sub[2]}`} mtxs={1} />
      )}
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* =============================== */}
        {/* PASTORS */}
        {/* =============================== */}
        <Box>
          <Box sx={{ my: 1 }}>
            {pastors && pastors.length > 0 && (
              <Pastor showInfo={true} pas={sortedPastors[0]} />
            )}
          </Box>
          <Grid container spacing={4} justifyContent="center">
            {pastors &&
              pastors.length > 0 &&
              sortedPastors.map((p, i) =>
                i === 0 ? null : (
                  <Grid key={i} item xs={12} sm={6} md={3} textAlign="center">
                    <Box sx={{ my: 1 }}>
                      <Pastor showInfo={true} pas={p} />
                    </Box>
                  </Grid>
                )
              )}
          </Grid>
        </Box>

        {mass &&
          mass.content.map((parish, idx) => {
            return (
              <Box key={idx}>
                {/* =============================== */}
                {/* COMMITTEE TABLE */}
                {/* =============================== */}
                {pages && pages.length > 0 && (
                  <CommitteeTable
                    // currentPc={Object.values(parishMap).flat()} // tất cả các parish
                    currentPc={parishMap[idx] || []}
                    church={parish.church}
                    pages={pages}
                    inits={inits}
                  />
                )}
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
