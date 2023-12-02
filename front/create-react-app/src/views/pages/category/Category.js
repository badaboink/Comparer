// import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { 
  Divider, 
  Grid, 
  Stack, Typography, 
  useMediaQuery
 } from '@mui/material';

// project imports
import CategoryWrapper from './CategoryWrapper';
import CategoryCardWrapper from './CategoryCardWrapper';
import CategoryInput from './CategoryInput';
import Footer from '../../../layout/MainLayout/Footer/index';
import { isLoggedIn, isAdmin } from '../../logic'
import {ERROR_PAGE, CATEGORY_URL} from '../../../apiUrls'

// assets

// ================================|| CATEGORY ||================================ //

const Category = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));

  const { id } = useParams();
  const userIsLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  
  useEffect(() => {
    if(!userIsLoggedIn || !userIsAdmin)
    {
      window.location.href = ERROR_PAGE;
    }
    if (id != "new") {
      fetchData(id);
    }
    else{
      setCategoryData({"name": "", "description": ""});
      setLoading(false);
    }
  }, []);
  const fetchData = async (id) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const categoryResponse = await fetch(`${CATEGORY_URL}/${id}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await categoryResponse.json();
      if (categoryResponse.status === 200) {
        if (responseData.success) {
          setCategoryData(responseData.category);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally{
      setLoading(false);
    }
  };

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
                            Category
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <CategoryInput isLoading={isLoading} name={categoryData.name} description={categoryData.description} id={id} />
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

export default Category;
