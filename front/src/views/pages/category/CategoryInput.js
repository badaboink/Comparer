import { useNavigate } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { CATEGORY_URL, ERROR_PAGE } from '../../../apiUrls';
import { isLoggedIn } from 'views/logic';



// ============================|| CATEGORY - CREATE/EDIT ||============================ //

const CategoryInput = ({ isLoading, name, description, id }) => {

  const theme = useTheme();
  const scriptedRef = useScriptRef();

  const navigate = useNavigate();
  const userIsLoggedIn = isLoggedIn();
  if(!userIsLoggedIn)
  {
    window.location.href = ERROR_PAGE;
    return null;
  }

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
          name: name,
          description: description,
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
              const category = {
                name: values.name,
                description: values.description,
              };
              if(id==='new')
              {
                const postResponse = await fetch(CATEGORY_URL, {
                  withCredentials: true,
                  method: 'POST',
                  headers: headers,
                  body: JSON.stringify(category),
                  credentials: 'include',
                });
                try {
                  const responseData = await postResponse.json();
                  if (postResponse.status === 201) {
                    if (responseData.success) {
                      navigate(-1);
                    } else {
                      const errorMessage = responseData.error || 'Posting category failed.';
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
                const postResponse = await fetch(`${CATEGORY_URL}/${id}`, {
                  withCredentials: true,
                  method: 'PATCH',
                  headers: headers,
                  body: JSON.stringify(category),
                  credentials: 'include',
                });
                try {
                  const responseData = await postResponse.json();
                  if (postResponse.status === 200) {
                    if (responseData.success) {
                      navigate(-1);
                    } else {
                      const errorMessage = responseData.error || 'Posting category failed.';
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
                id="category-name"
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
                <FormHelperText error id="category-name">
                  {errors.name}
                </FormHelperText>
              )}
            </FormControl>
            <Typography variant="h4">
              Description:
            </Typography>
            <FormControl fullWidth error={Boolean(touched.description && errors.description)} sx={{ ...theme.typography.customInput }}>
              <OutlinedInput
                id="category-description"
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
                <FormHelperText error id="category-description">
                  {errors.description}
                </FormHelperText>
              )}
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

export default CategoryInput;
