// import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { 
  Divider, 
  Grid, 
  Stack, Typography, 
  useMediaQuery,
  Box, Button,
  Autocomplete,
  Checkbox,
  TextField,
  Paper, 
  FormHelperText
 } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

// project imports
import SongCardWrapper from './SongCardWrapper';
// import CategoryCardWrapper from '../category/CategoryCardWrapper';
import SongInput from './SongInput';
import Footer from '../../../layout/MainLayout/Footer/index';
import { SONG_URL, 
  ADD_PLAYLIST_URL,
  ERROR_PAGE  
} from '../../../apiUrls';
import { isLoggedIn } from 'views/logic';
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets

const CustomPaper = (props) => {
  return <Paper elevation={2} {...props} />;
};

// ================================|| SONG ||================================ //

const Song = () => {
  const theme = useTheme();
  const userIsLoggedIn = isLoggedIn();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const [songData, setSongData] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [songsError, setSongsError] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();
  const { cd } = useParams();

  const customization = useSelector((state) => state.customization);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    if(!userIsLoggedIn)
    {
      window.location.href = ERROR_PAGE;
    }
    fetchSong();
  }, []);

  const handleSongSelectionChange = (event, newValue) => {
    setSelectedSongs(newValue);
  };
  const formatSongsForApi = (selectedSongs) => {
    const formattedSongs = selectedSongs.map(song => ({ id: song.id }));
    return { songs: formattedSongs };
  };

  const fetchSong = async () => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const songResponse = await fetch(`${SONG_URL}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await songResponse.json();
      if (songResponse.status === 200) {
        if (responseData.success) {
          const newArray = responseData.song.map(({ id, name, artist }) => ({ id, name, artist }));
          setSongData(newArray);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSongs = () => {
    const submitData = async () => {
      try {
        const headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        };
        const song = formatSongsForApi(selectedSongs);

        await fetch(ADD_PLAYLIST_URL+"/"+cd, {
          withCredentials: true,
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(song),
          headers: headers,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    if(selectedSongs.length != 0)
    {
      submitData();
      navigate(-1);
    }
    else{
      setSongsError("No songs selected");
    }
  };

  return (
    // <CategoryWrapper>
      <Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: 'calc(100vh - 68px)' }}>
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <SongCardWrapper>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                  <Grid item xs={12}>
                    <Grid container direction={matchDownSM ? 'column-reverse' : 'row'} alignItems="center" justifyContent="center">
                      <Grid item>
                        <Stack alignItems="center" justifyContent="center" spacing={1}>
                          <Typography color={theme.palette.secondary.main} gutterBottom variant={matchDownSM ? 'h3' : 'h2'}>
                            Song
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  {id === 'new' && cd && (
                  
                  <>
                   <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    options={songData}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option) => option.name + " – " + option.artist}
                    PaperComponent={CustomPaper}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name} – {option.artist}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Add songs to this playlist" placeholder="Songs" />
                    )}
                    value={selectedSongs}
                    onChange={handleSongSelectionChange}
                  />
                  <FormHelperText error id="playlist-songs">
                  {songsError}
                  </FormHelperText>
                  </Grid>
                  <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button onClick={handleSongs} disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
                      Save
                    </Button>
                  </AnimateButton>
                </Box></Grid>
                <Grid item xs={12}>
                  <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 0,
                                borderColor: `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]}!important`,
                                fontWeight: 500,
                                borderRadius: `${customization.borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            OR
                        </Button>

                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                    </Grid>
                    </>)}
                    {id !== 'new' && (
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>)}
                  <Grid item xs={12} >
                    <SongInput id={id} nullable_playlistId={cd} />
                  </Grid>
                </Grid>
              </SongCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 1, mt: 1 }}>
          <Footer />
        </Grid>
      </Grid>
    // </CategoryWrapper>
  );
};

export default Song;
