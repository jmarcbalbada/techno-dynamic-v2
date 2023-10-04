import { styled } from '@mui/material';
import Grid from '@mui/material/Grid';

const HeroGrid = styled(Grid)(({ theme }) => ({
  backgroundImage: 'url(https://source.unsplash.com/random/featured/?working,office)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}));

export default HeroGrid;
