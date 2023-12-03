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
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { SONG_URL, PLAYLIST_URL, ERROR_PAGE } from '../../../apiUrls';
import { isLoggedIn } from 'views/logic';


// ============================|| SONG - CREATE/EDIT ||============================ //

const SongInput = ({ id, nullable_playlistId }) => {

  const theme = useTheme();
  const userIsLoggedIn = isLoggedIn();
  const [selectedImage, setSelectedImage] = useState(null);

  const currentYear = new Date().getFullYear();

  const scriptedRef = useScriptRef();
  const [isLoading, setLoading] = useState(true);
  const [songData, setSongData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    if (id !== 'new') {
      
      fetchData(id);
    }
    else{
      setSongData({"name": "", "artist": "", "year": "", "artwork": ""});
      setLoading(false);
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
      const songResponse = await fetch(`${SONG_URL}/${id}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await songResponse.json();
      if (songResponse.status === 200) {
        if (responseData.success) {
          setSongData(responseData.song)
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
          name: songData.name,
          artist: songData.artist,
          year: songData.year,
          artwork: songData.artwork,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().matches(/^[a-zA-Z0-9,?.! \s-]+$/, 'Invalid name format').max(100).required('Name is required'),
          artist: Yup.string()
          .matches(/^[a-zA-Z0-9,?.! \s-]+$/, 'Invalid artist format')
          .max(100)
          .required('Artist is required'),
          year: Yup.number()
          .integer('Year must be an integer')
          .min(1800, 'Year must be greater than or equal to 1900')
          .max(currentYear, `Year must be less than or equal to the current year (${currentYear})`)
          .required('Year is required'),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current) {
              const headers = {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
              };
              const formData = new FormData();
              formData.append('name', values.name);
              formData.append('artist', values.artist);
              formData.append('year', values.year);
        
              if (selectedImage) {
                formData.append('artwork', selectedImage);
              }
              const requestConfig = {
                withCredentials: true,
                method: id === 'new' ? 'POST' : 'PATCH',
                headers: headers,
                body: formData,
                credentials: 'include',
              };
              let url = id === 'new' ? SONG_URL : `${SONG_URL}/${id}`;
              if (nullable_playlistId !== undefined) {
                url = id === 'new' ? `${PLAYLIST_URL}/${nullable_playlistId}/songs/` : `${PLAYLIST_URL}/${nullable_playlistId}/songs/${id}`;
              }
              const postResponse = await fetch(url, requestConfig);
              try {
                const responseData = await postResponse.json();
                if (postResponse.status === (id === 'new' ? 201 : 200)) {
                  if (responseData.success) {
                    navigate(-1);
                  } else {
                    const errorMessage = responseData.error || 'Posting song failed.';
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
              Artist:
            </Typography>
            <FormControl fullWidth error={Boolean(touched.artist && errors.artist)} sx={{ ...theme.typography.customInput }}>
              <OutlinedInput
                id="playlist-artist"
                type="text"
                value={values.artist}
                name="artist"
                onBlur={handleBlur}
                onChange={handleChange}
                label="artist"
                inputProps={{}}
                sx={{ width: '100%', padding: '15px', resize: 'none', whiteSpace: 'break-spaces' }}
                multiline
                />
              {touched.artist && errors.artist && (
                <FormHelperText error id="playlist-artist">
                  {errors.artist}
                </FormHelperText>
              )}
            </FormControl>
            <Typography variant="h4">
              Year:
            </Typography>
            <FormControl fullWidth error={Boolean(touched.year && errors.year)} sx={{ ...theme.typography.customInput }}>
              <OutlinedInput
                id="playlist-year"
                type="year"
                value={values.year}
                name="year"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Year"
                inputProps={{}}
                sx={{ width: '100%', resize: 'none', whiteSpace: 'break-spaces' }}
                multiline
                />
              {touched.year && errors.year && (
                <FormHelperText error id="playlist-year">
                  {errors.year}
                </FormHelperText>
              )}
            </FormControl>
              <Typography variant="h4">Artwork:</Typography>
              <center>
                {songData.artwork && (
                  
              <img src={songData.artwork} alt="Artwork" style={{
                width: '100%',
                height: 'auto',
                maxWidth: '500px'
              }}></img>
              
              )}
              </center>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setSelectedImage(event.target.files[0]);
                }}
              />

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

export default SongInput;
