import { Box, Typography } from '@mui/material';
import Pastor from './Pastors';
import { Committees, CommitteeTable } from './Committee';
import { useImagePreview } from '../leftside/PreviewAds';
import { BigPic } from '../leftside/Ads';
import { SectionLeft } from '../leftside/anounceSub';
import {
  displaymd,
  displaysm,
  typeMass,
  typePages,
  typeParishCouncil,
  typePastors,
  typeTerms,
} from '../Constain';

export default function ParishCouncils({ inits }) {
  const parishCouncil = JSON.parse(
    inits.find((item) => item.type === typeParishCouncil).data
  );
  const terms = JSON.parse(inits.find((item) => item.type === typeTerms).data);
  const parishMap = {};
  // Hàm để lấy chỉ số của term có năm kết thúc cao nhất
  const getTermIndexWithHighestEndYear = (terms) => {
    let highestEndYear = -Infinity; // Khởi tạo giá trị năm kết thúc cao nhất ban đầu
    let highestIndex = -1; // Chỉ số của term có năm kết thúc cao nhất
    // Duyệt qua tất cả các term và tìm năm kết thúc cao nhất
    terms.forEach((term, index) => {
      const endYear = term.split(' - ').map(Number)[1]; // Tách năm bắt đầu và năm kết thúc
      if (endYear > highestEndYear) {
        highestEndYear = endYear;
        highestIndex = index; // Lưu lại chỉ số của term có năm kết thúc cao nhất
      }
    });
    return highestIndex;
  };
  // Lấy chỉ số của term có năm kết thúc cao nhất
  const maxTerm = getTermIndexWithHighestEndYear(terms);
  // group data theo parish
  parishCouncil &&
    parishCouncil.forEach((p) => {
      if (p.term === maxTerm) {
        if (!parishMap[p.parish]) parishMap[p.parish] = [];
        parishMap[p.parish].push(p);
      }
    });
  // sort từng parish theo role (role là số)
  Object.keys(parishMap).forEach((key) => {
    parishMap[key].sort((a, b) => a.role - b.role);
  });
  const pages = JSON.parse(inits.find((item) => item.type === typePages).data);
  const { preview, pos, handleMove, handleEnter, handleLeave } =
    useImagePreview({ preview_size: 100, margin: 0, addOffsetY: -150 });

  const mass = JSON.parse(inits.find((item) => item.type === typeMass).data)[0];
  const pastors = JSON.parse(
    inits.find((item) => item.type === typePastors).data
  );
  // ===============================
  // PAGE UI
  // ===============================
  return (
    <>
      <Box>
        {/* =============================== */}
        {/* PASTORS */}
        {/* =============================== */}
        <Box display={displaysm}>
          {pastors &&
            pastors.length > 0 &&
            pastors.map((p, i) =>
              p.yearEnd !== null ? null : (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Pastor showInfo={true} pas={p} />
                  <Typography
                    sx={{
                      width: { xs: '100%', md: '80%', lg: '60%' },
                      fontSize: 'larger',
                      my: 2,
                    }}
                  >
                    {p.details}
                  </Typography>
                </Box>
              )
            )}
        </Box>
        <Box display="block">
          {pages && pages.length > 0 && (
            <SectionLeft body={`${pages[pages.length - 1].sub[0]}`} mtxs={1} />
          )}
        </Box>
        {mass &&
          mass.content.map((parish, idx) => {
            return (
              <Box key={idx}>
                {/* =============================== */}
                {/* COMMITTEE */}
                {/* =============================== */}
                <Committees
                  church={parish.church}
                  currentPc={parishMap[idx] || []}
                  inits={inits}
                />
                {/* =============================== */}
                {/* COMMITTEE TABLE */}
                {/* =============================== */}
                <Box display={displaymd}>
                  {pages && pages.length > 0 && parishMap && (
                    <CommitteeTable
                      // currentPc={Object.values(parishMap).flat()} // tất cả các parish
                      currentPc={parishMap[idx] || []}
                      church={parish.church}
                      handleMove={handleMove}
                      handleEnter={handleEnter}
                      handleLeave={handleLeave}
                      pages={pages}
                      inits={inits}
                    />
                  )}
                </Box>
              </Box>
            );
          })}
      </Box>
      {/* ⭐ Ảnh phóng to */}
      {preview && (
        <BigPic
          pos={pos}
          preview_width={220}
          preview_height={260}
          preview={preview}
          display="block"
        />
      )}
    </>
  );
}
