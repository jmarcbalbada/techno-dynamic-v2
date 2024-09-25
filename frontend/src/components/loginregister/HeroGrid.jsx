import { styled } from '@mui/material';
import Grid from '@mui/material/Grid';

const HeroGrid = styled(Grid)(({ theme }) => ({
  backgroundImage: 'url(/wil/wil1.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}));

export default HeroGrid;
