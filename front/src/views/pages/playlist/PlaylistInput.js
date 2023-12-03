import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  Typography,
  Autocomplete,
  TextField,
  Paper 
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { PLAYLIST_URL, CATEGORY_URL, ERROR_PAGE } from '../../../apiUrls';
import { isLoggedIn } from 'views/logic';


const CustomPaper = (props) => {
  return <Paper elevation={2} {...props} />;
};

// ============================|| PLAYLIST - CREATE/EDIT ||============================ //

const PlaylistInput = ({ id, nullable_categoryId }) => {
  
  const theme = useTheme();
  const userIsLoggedIn = isLoggedIn();
  const scriptedRef = useScriptRef();

  
  const [playlistData, setPlaylistData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (id !== 'new') {
      fetchData(id);
    }
    else{
      setPlaylistData({"name": "", "description": ""});
      fetchCategory();
    }
  }, []);

  
  if(!userIsLoggedIn)
  {
    window.location.href = ERROR_PAGE;
    return null;
  }

  const fetchData = async (id) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const playlistResponse = await fetch(`${PLAYLIST_URL}/${id}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await playlistResponse.json();
      if (playlistResponse.status === 200) {
        if (responseData.success) {
          setPlaylistData(responseData.playlist);
        }
      }

      const categoryResponse = await fetch(`${CATEGORY_URL}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData2 = await categoryResponse.json();
      if (categoryResponse.status === 200) {
        if (responseData2.success) {
          const newArray = responseData2.category.map(({ id, name }) => ({ id, name }));
          setCategoryData(newArray);
        }
      }
      const categoryId = responseData.playlist.category;
      const matchingCategory = responseData2.category.find(category => category.id === categoryId);
      setSelectedCategoryId(matchingCategory ? { id: matchingCategory.id, name: matchingCategory.name } : null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally{
      setLoading(false);
    }
  };
  const fetchCategory = async () => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const categoryResponse = await fetch(`${CATEGORY_URL}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await categoryResponse.json();
      if (categoryResponse.status === 200) {
        if (responseData.success) {
          const newArray = responseData.category.map(({ id, name }) => ({ id, name }));
          setCategoryData(newArray);
        }
      }
      if(nullable_categoryId !== null)
      {
        const matchingCategory = responseData.category.find(category => category.id === parseInt(nullable_categoryId));
        setSelectedCategoryId(matchingCategory ? { id: matchingCategory.id, name: matchingCategory.name } : null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally{
      setLoading(false);
    }
  };



  return (
    <>
      <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
          </Box>
        </Grid>
      </Grid>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
      <Formik
        initialValues={{
          name: playlistData.name,
          description: playlistData.description,
          category: selectedCategoryId,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().matches(/^[a-zA-Z0-9,?.! \s-]+$/, 'Invalid name format').max(100).required('Name is required'),
          description: Yup.string()
          .matches(/^[a-zA-Z0-9,?.! \s-]+$/, 'Invalid description format')
          .max(150)
          .required('Description is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) { 
              const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
              };
              const playlist = {
                name: values.name,
                description: values.description,
                category: selectedCategoryId.id,
              };
              
              if(id==='new')
              {
                const postResponse = await fetch(PLAYLIST_URL, {
                  withCredentials: true,
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify(playlist),
                  credentials: 'include',
                });
                try {
                  const responseData = await postResponse.json();
                  if (postResponse.status === 201) {
                    if (responseData.success) {
                      navigate(-1);
                    } else {
                      const errorMessage = responseData.error || 'Posting playlist failed.';
                      throw new Error(errorMessage);
                    }
                  } else {
                    setStatus({ success: false });
                    setErrors({ submit: responseData.error });
                    setSubmitting(false);
                  }
                } catch (jsonError) {
                  setStatus({ success: false });
                  setErrors({ submit: 'Invalid response from the server' });
                  setSubmitting(false);
                }
              }
              else{
                const postResponse = await fetch(`${PLAYLIST_URL}/${id}`, {
                  withCredentials: true,
                  method: 'PATCH',
                  headers: headers,
                  body: JSON.stringify(playlist),
                  credentials: 'include',
                });
                try {
                  const responseData = await postResponse.json();
                  if (postResponse.status === 200) {
                    if (responseData.success) {
                      navigate(-1);
                    } else {
                      const errorMessage = responseData.error || 'Posting playlist failed.';
                      throw new Error(errorMessage);
                    }
                  } else {
                    setStatus({ success: false });
                    setErrors({ submit: responseData.error });
                    setSubmitting(false);
                  }
                } catch (jsonError) {
                  setStatus({ success: false });
                  setErrors({ submit: 'Invalid response from the server' });
                  setSubmitting(false);
                }
              }
            }
          } catch (err) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Typography variant="h4">
              Name:
            </Typography>
            <FormControl fullWidth error={Boolean(touched.name && errors.name)} sx={{ ...theme.typography.customInput }}>
              <OutlinedInput
                id="playlist-name"
                type="text"
                value={values.name}
                name="name"
                onBlur={handleBlur}
                onChange={handleChange}
                label="name"
                inputProps={{}}
                multiline
              />
              {touched.name && errors.name && (
                <FormHelperText error id="playlist-name">
                  {errors.name}
                </FormHelperText>
              )}
            </FormControl>
            <Typography variant="h4">
              Description:
            </Typography>
            <FormControl fullWidth error={Boolean(touched.description && errors.description)} sx={{ ...theme.typography.customInput }}>
              <OutlinedInput
                id="playlist-description"
                type="text"
                value={values.description}
                name="description"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Description"
                inputProps={{}}
                sx={{ width: '100%', minHeight: '60px', padding: '15px', resize: 'none', whiteSpace: 'break-spaces' }}
                multiline
                />
              {touched.description && errors.description && (
                <FormHelperText error id="playlist-description">
                  {errors.description}
                </FormHelperText>
              )}
            </FormControl>
            <Typography variant="h4">
              Category:
            </Typography>
            <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
                {values.category != "" && (<Autocomplete
                  id="playlist-category"
                  name="category"
                  label="Category"
                  value={values.category}
                  options={categoryData}
                  PaperComponent={CustomPaper}
                  getOptionLabel={(option) => (option ? option.name : '')}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} label="" variant="outlined"/>}
                  onChange={(event, newValue) => {
                    setSelectedCategoryId(newValue);
                  }}
                />)}
                {values.category == "" && (<Autocomplete
                  disablePortal
                  id="playlist-category"
                  name="category"
                  label="Category"
                  options={categoryData}
                  getOptionLabel={(option) => (option ? option.name : '')}
                  PaperComponent={CustomPaper}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={(params) => <TextField {...params} label="" />}
                  onChange={(event, newValue) => {
                    setSelectedCategoryId(newValue);
                  }}
                />)}
            </FormControl>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <AnimateButton>
                <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="secondary">
                  Save
                </Button>
              </AnimateButton>
            </Box>
          </form>
        )}
      </Formik>)}
    </>
  );
};

export default PlaylistInput;
