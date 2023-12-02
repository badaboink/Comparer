import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

// material-ui
import { styled, } from '@mui/material/styles';
import { Box, Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
// import SkeletonCategoryCard from 'ui-component/cards/Skeleton/CategoryCard';

// assets
// import { 
//   // ERROR_PAGE, 
//   PLAYLIST_URL } from 'apiUrls';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.secondary[200]}, ${theme.palette.primary[200]})`,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  height: '3rem',
  transition: 'height 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
  },
}));


// ===========================|| DASHBOARD DEFAULT - Category CARD ||=========================== //

const SongCardShort = ({ name, link }) => {
  const navigate = useNavigate();

  const handleSongClick = () =>{
    navigate(link);
  };

  return (
    <>
        <CardWrapper border={false} content={false} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 1.8, height: '7rem', }}>
            <Grid container direction="column">
              <Grid item>
                
              </Grid>
              <Grid >
                <Grid item>
                  <Grid container alignItems="center">
                      
                    <Grid item onClick={() => handleSongClick()} sx={{
                      '&:hover': {
                        cursor: 'pointer',
                      },
                    }} lg={true}  md={true} sm={true} xs={true} >
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, mr: 0, mt: 0, mb: 0.75,  }}>{name}</Typography>
                    </Grid>
                    <Grid item>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
    </>
  );
};

SongCardShort.propTypes = {
  name: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default SongCardShort;
