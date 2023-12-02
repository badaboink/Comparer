import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import DeleteConfirmationModal from '../../../ui-component/DeleteConfirmationModal';
import { SONG_URL, 
  ADD_PLAYLIST_URL
 } from 'apiUrls';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';



const CardWrapper = styled(MainCard)(({ theme, image }) => ({
  background: `linear-gradient(to right, ${theme.palette.secondary[200]}, ${theme.palette.primary[200]})`,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  height: '3rem',
  transition: 'height 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    height: '15rem',
    // background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    background: `url(${image}) center/cover`
  },
}));

// ===========================|| SONG CARD ||=========================== //

const SongCard = ({ index, name, id, fetchData, playlistOwner, year, artist, songOwner, pk, image }) => {

  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemove = () => {
    const deleteData = async () => {
      try {
        const headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        };
        const formattedSongs = { song: { id: id}}
        console.log(formattedSongs);
        await fetch(ADD_PLAYLIST_URL+"/"+pk, {
          withCredentials: true,
          method: 'DELETE',
          credentials: 'include',
          body: JSON.stringify(formattedSongs),
          headers: headers,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    deleteData();
    fetchData(id);
  };
  const handleSongDelete = () => {
    setAnchorEl(null);
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  const handleDeleteConfirmed = () => {
    const deleteData = async () => {
      try {
        const headers = {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        };
        await fetch(SONG_URL+"/"+id, {
          withCredentials: true,
          method: 'DELETE',
          credentials: 'include',
          headers: headers,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    deleteData();
    fetchData(id);
  };
  const handleSongClick = () =>{
    // navigate(link);
  };
  const handleSongEdit = (id) =>{
    navigate(`/song/${id}`);
  }

  return (
    <>
        <CardWrapper border={false} theme={theme} image={image} content={false} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 1.4, height: '7rem', ml: 0.7}}>
            <Grid container direction="column">
              <Grid item>
                
              </Grid>
              <Grid >
                <Grid item>
                  <Grid container alignItems="center">
                      
                    <Grid item onClick={() => handleSongClick()} lg={true}  md={true} sm={true} xs={true} >
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 500, mr: 0, mt: 0, mb: 0,  }}>{index+1}. {name} – {artist}</Typography>
                    </Grid>
                    
                    <Grid item>  
                    <Grid container>
                      <> {playlistOwner && (
                        <Avatar
                          variant="rounded"
                          sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary[200],
                            zIndex: 1,
                            height: '1.7rem',
                            width: '1.7rem',
                          }}
                          aria-controls="menu-earning-card"
                          aria-haspopup="true"
                          onClick={handleRemove}
                        >
                          <ClearIcon fontSize="inherit" />
                        </Avatar>   )}   
                      </>        
                      <>
                      {songOwner && (
                        <Grid item>
                          <Avatar
                            variant="rounded"
                            sx={{
                              ...theme.typography.commonAvatar,
                              ...theme.typography.mediumAvatar,
                              backgroundColor: theme.palette.primary.dark,
                              color: theme.palette.primary[200],
                              zIndex: 1,
                              height: '1.7rem',
                              width: '1.7rem',
                              ml: '0.2rem',
                            }}
                            aria-controls="menu-earning-card"
                            aria-haspopup="true"
                            onClick={handleClick}
                          >
                            <MoreHorizIcon fontSize="inherit" />
                          </Avatar>
                          <Menu
                            id="menu-earning-card"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            variant="selectedMenu"
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right'
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right'
                            }}
                          >
                            <MenuItem onClick={() =>handleSongEdit(id)}>
                              <EditIcon sx={{ mr: 0 }} /> Edit
                            </MenuItem>
                            <MenuItem onClick={handleSongDelete}>
                              <DeleteIcon sx={{ mr: 0 }} /> Delete
                            </MenuItem>
                          </Menu>
                        </Grid>
                        )}
                      </>
                    </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sx={{ mt: 2, mb: 1.25,}} onClick={() => handleSongClick(id)} >
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      maxWidth: '44rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {year}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <img
            src={image}
            alt="Artwork"
            style={{
              position: 'absolute',
              width: '100%',
              height: 'auto',
              maxWidth: '500px',
              top: 0,
              left: 0,
              zIndex: -1,
            }}
          />
        </CardWrapper>
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDeleteConfirmed={handleDeleteConfirmed}
        />
    </>
  );
};

SongCard.propTypes = {
  name: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default SongCard;
