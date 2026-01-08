import React from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Button, Typography } from '@mui/material';
import {
  backend,
  colorMainLetter,
  colorSub4Letter,
  colorSub5Letter,
  colorSub6Letter,
} from '../Constain';

// Component con để render mục nhỏ trong danh sách
export function SectionLeft({ body, mtxs }) {
  return (
    <Typography
      fontWeight="bold"
      gutterBottom
      sx={{
        borderBottom: '1px solid #ccc',
        fontSize: { xs: '1.25rem', sm: '1.5rem' },
        py: 0,
        mt: { xs: mtxs, sm: 1 },
        mb: { xs: 0, sm: 1 },
      }}
    >
      {body}
    </Typography>
  );
}
export function SectionItem({ title, children, span, note }) {
  return (
    <Box sx={{ mb: { xs: 0.2, sm: 2 } }}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        color={colorSub4Letter}
        gutterBottom
        component={span}
        sx={{ mb: { xs: 0, sm: 1 }, mt: { xs: 1, sm: 0 } }}
      >
        {title + ': '}
      </Typography>
      <Typography component={span}>{children}</Typography>
      {note && (
        <Typography
          sx={{ color: colorSub5Letter }}
          component={span}
        >{` (${note})`}</Typography>
      )}
    </Box>
  );
}
export function ChurchDetails({ fontW, c, fSz, my, detail }) {
  return (
    <Typography
      fontWeight={fontW}
      textAlign="right"
      color={c}
      sx={{
        fontSize: fSz,
        my: my,
      }}
    >
      {detail}
    </Typography>
  );
}
export const PdfViewer = ({ name, type }) => {
  const pdfUrl = `${backend}pdf/${type}`; // backend trả PDF theo type
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <PictureAsPdfIcon color={colorMainLetter} />
      <Button
        component="a"
        href={pdfUrl}
        // href={`/${name}#toolbar=0&navpanes=0`}
        // target="_blank"
        rel="noopener noreferrer"
        sx={{
          fontWeight: 'bold',
          textDecoration: 'underline',
          textTransform: 'none',
          color: colorSub6Letter,
          '&:hover': { color: colorSub5Letter, textDecoration: 'underline' },
        }}
      >
        {name}
      </Button>
    </Box>
  );
};
