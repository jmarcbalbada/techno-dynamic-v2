import { styled } from '@mui/material';
import Paper from '@mui/material/Paper';

const FieldPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: 'rgba(0, 0, 0, 0.09) 0px 3px 12px'
}));

export default FieldPaper;
