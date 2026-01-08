import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  bgColorSub2Table,
  bgColorSubTable,
  colorMainLetter,
  displayxssm,
  tableMemeryBook,
  tableParishCouncil,
  typeRoles,
  typeTerms,
} from '../Constain';
import parishCouncilImg from '../assets/parishcouncil.jpg';

export const Committees = ({ church, currentPc, inits }) => {
  const roles = JSON.parse(inits.find((item) => item.type === typeRoles).data);
  return (
    <Grid
      container
      spacing={4}
      justifyContent="center"
      sx={{ mt: 4, display: displayxssm }}
    >
      {currentPc.map((p, i) => (
        <Grid
          item
          key={i}
          xs={12}
          sm={6}
          md={3}
          textAlign="center"
          sx={{ mb: !p.img ? null : 2 }}
        >
          <Box
            component="img"
            src={p.img ? p.img : parishCouncilImg}
            alt={p.name}
            sx={{
              width: 180,
              height: 210,
              objectFit: 'cover',
              border: '1px solid white',
              p: 1,
              borderRadius: 2,
              boxShadow: 3,
              mb: 1,
            }}
          />
          <Typography fontWeight="600">{p.name}</Typography>
          {roles && roles.length > 0 && (
            <Typography>{roles[p.role]}</Typography>
          )}
          <Typography>{p.phone}</Typography>
          <Typography>{church}</Typography>
        </Grid>
      ))}
    </Grid>
  );
};

export const CommitteeTable = ({
  currentPc,
  church,
  handleMove,
  handleEnter,
  handleLeave,
  pages,
  inits,
}) => {
  const roles = JSON.parse(inits.find((item) => item.type === typeRoles).data);
  const terms = JSON.parse(inits.find((item) => item.type === typeTerms).data);
  return currentPc.length === 0 ? null : (
    <TableContainer
      component={Paper}
      sx={{
        mt: 6,
        mb: 4,
        backgroundColor: 'transparent',
        color: colorMainLetter,
      }}
    >
      <Table sx={{ p: 2 }}>
        <TableHead sx={{ backgroundColor: bgColorSubTable }}>
          <TableRow>
            <TableCell sx={{ color: colorMainLetter }}>
              <strong>
                {handleMove ? tableParishCouncil[0] : tableMemeryBook[0]}
              </strong>
            </TableCell>
            <TableCell sx={{ color: colorMainLetter }}>
              {handleMove ? tableParishCouncil[1] : tableMemeryBook[1]}
            </TableCell>
            <TableCell sx={{ color: colorMainLetter }}>
              {roles && roles.length > 0 && (
                <strong>{handleMove ? tableParishCouncil[2] : roles[0]}</strong>
              )}
            </TableCell>
            <TableCell sx={{ color: colorMainLetter }}>
              {!handleMove ? (
                pages ? (
                  pages[pages.length - 1].sub[0]
                ) : null
              ) : (
                <strong>
                  {tableParishCouncil[3]}{' '}
                  <Box
                    component={'span'}
                    sx={{ display: { md: 'none', lg: 'inline-block' } }}
                  >
                    {tableParishCouncil[4]}
                  </Box>
                </strong>
              )}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {currentPc.map((pC, i) =>
            pC.role === 0 || handleMove ? (
              <TableRow
                key={i}
                sx={{
                  borderBottom: '1px solid white',
                  backgroundColor:
                    i % 2 === 0 ? bgColorSub2Table : 'transparent',
                }}
              >
                {roles && roles.length > 0 && terms && terms.length > 0 && (
                  <TableCell sx={{ color: colorMainLetter }}>
                    {handleMove ? roles[pC.role] : terms[pC.term]}
                  </TableCell>
                )}
                <TableCell sx={{ color: colorMainLetter }}>{church}</TableCell>
                <TableCell
                  sx={{
                    color: colorMainLetter,
                    display: 'flex',
                    alignItems: 'center',
                    ml: 1,
                    borderBottom: 'none',
                  }}
                >
                  {!handleLeave ? null : (
                    <Box
                      component="img"
                      src={pC.img ? pC.img : parishCouncilImg}
                      alt={pC.name}
                      sx={{
                        width: 55,
                        cursor: 'pointer', // ⭐ con trỏ chuột thành ngón tay
                        height: 65,
                        objectFit: 'cover',
                        mr: 3,
                      }}
                      onMouseEnter={() => handleEnter(pC.img)}
                      onMouseMove={handleMove}
                      onMouseLeave={handleLeave}
                    />
                  )}
                  <Typography>{pC.name}</Typography>
                </TableCell>
                <TableCell
                  sx={{ color: colorMainLetter, whiteSpace: 'pre-line' }}
                >
                  {handleMove
                    ? pC.phone
                    : currentPc
                        .filter((x) => x.term === pC.term)
                        .filter((x) => [1, 2, 3].includes(x.role))
                        .map((x) => x.name.trim())
                        .join(',\n')}
                </TableCell>
              </TableRow>
            ) : null
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
