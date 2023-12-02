// import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { 
  Divider, 
  Grid, 
  Stack, Typography, 
  useMediaQuery
 } from '@mui/material';

// project imports
import CategoryWrapper from '../category/CategoryWrapper';
import CategoryCardWrapper from '../category/CategoryCardWrapper';
import PlaylistInput from './PlaylistInput';
import Footer from '../../../layout/MainLayout/Footer/index';
// import {isLoggedIn} from '../../logic';
// import {ERROR_PAGE} from '../../../apiUrls';

// assets

// ================================|| PLAYLIST INPUT ||================================ //

const Playlist = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const { id } = useParams();
  const { cd } = useParams();


  // const userIsLoggedIn = isLoggedIn();
  // const userIsAdmin = isAdmin();

  return (
    <CategoryWrapper>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <CategoryCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Playlist
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <PlaylistInput id={id} nullable_categoryId={cd} />
                  </Grid>
                </Grid>
              </CategoryCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <Footer />
        </Grid>
      </Grid>
    </CategoryWrapper>
  );
};

export default Playlist;
