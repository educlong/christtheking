import { Box, Typography } from '@mui/material';
import {
  ChurchDetails,
  PdfViewer,
  SectionItem,
  SectionLeft,
} from './anounceSub';
import Ads from './Ads';
import Pastor from '../rightsideContact/Pastors';
import { useFetchPdfs } from '../server/InitsHandle';
import {
  colorMainLetter,
  colorSub7Letter,
  displaysm,
  displayxs,
  typeBulletin,
  typeMass,
  typePastors,
  typeSacraments,
} from '../Constain';

export default function AnouncementAds({ images, inits }) {
  const mass = JSON.parse(inits.find((item) => item.type === typeMass).data)[0];
  const sacraments = JSON.parse(
    inits.find((item) => item.type === typeSacraments).data
  );
  const pastors = JSON.parse(
    inits.find((item) => item.type === typePastors).data
  );
  const bulletin = inits.find((item) => item.type === typeBulletin).data;
  const { pdfs: weeklyBulletinInit } = useFetchPdfs(typeBulletin);
  const weeklyBulletin =
    weeklyBulletinInit.length > 0 ? weeklyBulletinInit[0] : '';
  return (
    <Box
      sx={{
        mx: 'auto',
        pr: { xs: 2, sm: 0 },
        pl: 3,
        py: { xs: 0, sm: 4 },
        borderRadius: 3,
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        borderRight: { xs: '1px solid rgba(255,255,255,0.1)', sm: 'none' },
        borderTop: { xs: 'none', sm: '1px solid rgba(255,255,255,0.1)' },
        borderBottom: { xs: 'none', sm: '1px solid rgba(255,255,255,0.1)' },
      }}
    >
      {/* Weekly Bulletin */}
      {bulletin && <SectionLeft body={bulletin} mtxs={0} />}
      {weeklyBulletin && (
        <PdfViewer
          name={weeklyBulletin.name}
          type={weeklyBulletin.type} // để backend lấy PDF
        />
      )}

      {/* Mass Times Section */}
      {mass && <SectionLeft body={mass.name} mtxs={2} />}
      {mass &&
        mass.content.map((m, idx) => (
          <div key={idx}>
            <ChurchDetails
              fontW={'bold'}
              c={colorSub7Letter}
              fSz={{ xs: '1.05rem', sm: '1.25rem' }}
              my={{ xs: 0.5, sm: 1 }}
              detail={m.church}
            />
            <ChurchDetails
              fontW={'normal'}
              c={colorMainLetter}
              fSz={'small!important'}
              my={{ xs: 0.3 }}
              detail={`${m.address}, ${m.city}, ${m.state} ${m.postalCode}`}
            />
            <ChurchDetails
              fontW={'normal'}
              c={colorMainLetter}
              fSz={'small!important'}
              my={{ xs: 0.3 }}
              detail={`${m.phone}`}
            />
            <ChurchDetails
              fontW={'normal'}
              c={colorMainLetter}
              fSz={'small!important'}
              my={{ xs: 0.3 }}
              detail={`${m.email}`}
            />
            <Box sx={{ mt: { xs: 0, sm: 2 }, mb: { xs: 0, sm: 3 } }}>
              {m.time.map((t, i) => (
                <Box key={i}>
                  <SectionItem
                    title={t.day}
                    children={t.mass}
                    span="span"
                    note={t.note}
                  />
                </Box>
              ))}
            </Box>
          </div>
        ))}
      <Box display={displayxs}>
        {pastors &&
          pastors.map((p, i) =>
            p.yearEnd !== null ? null : (
              <Box key={i}>
                <Pastor showInfo={true} pas={p} />
              </Box>
            )
          )}
      </Box>
      {/* Sacraments Section */}
      {sacraments && <SectionLeft body={sacraments.name} mtxs={2} />}
      <Box sx={{ mt: { xs: 1, sm: 2 } }}>
        {sacraments &&
          sacraments.content.map((Sacrament, idx) => (
            <SectionItem
              title={Sacrament.title}
              key={idx}
              children={Sacrament.sub}
              span="div"
            />
          ))}
      </Box>
      <Box sx={{ mt: '100px', display: displaysm }}>
        <Ads images={images} inits={inits} />
      </Box>
    </Box>
  );
}
