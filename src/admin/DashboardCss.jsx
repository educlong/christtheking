import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  styled,
} from '@mui/material';

// ===== Custom Accordion =====
export const CustomAccordion = styled(Accordion)(() => ({
  background: 'linear-gradient(135deg, #f8f9fa, #eef2f7)',
  borderRadius: '12px !important',
  marginBottom: 12,
  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:before': {
    display: 'none',
  },
  '&:hover': {
    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)',
  },
}));
export const CustomSummary = styled(AccordionSummary)(() => ({
  borderRadius: '12px',
  background: 'linear-gradient(90deg, #4e73df, #1cc7d0)',
  color: 'white',
  '& .MuiAccordionSummary-expandIconWrapper': {
    color: 'white',
    transition: 'transform 0.3s ease',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
}));
export const CustomDetails = styled(AccordionDetails)(() => ({
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: '0 0 12px 12px',
  lineHeight: 1.7,
}));
export const Capitalize = (s) =>
  s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : '';
