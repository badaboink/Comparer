import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import {isOwner} from '../../logic';
import DeleteConfirmationModal from '../../../ui-component/DeleteConfirmationModal';
import {
  PLAYLIST_URL } from 'apiUrls';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
  transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.01)',
    background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.main})`,
  },
}));


// ===========================|| DASHBOARD DEFAULT - Category CARD ||=========================== //

const PlaylistCard = ({ name, description, id, fetchData, link, owner }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const viewerIsOwner = isOwner(owner);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePlaylistDelete = () => {
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
        await fetch(PLAYLIST_URL+"/"+id, {
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
    setAnchorEl(null);
    fetchData(id);
  };
  const handlePlaylistClick = () =>{
    navigate(link);
  };
  const handlePlaylistEdit = (id) =>{
    navigate(`/playlist/${id}`);
  }

  return (
    <>
        <CardWrapper border={false} content={false} sx={{ maxWidth: '100%', overflow: 'hidden' }}>
          <Box sx={{ p: 1.85, height: '7rem' }}>
            <Grid container direction="column">

              <Grid 
              sx={{
                overflow: 'auto', // Enable vertical scroll if content overflows
                maxHeight: '6rem', // Set a maximum height for the combined content
              }}
              >
                            <>
  <Grid container direction="row" justifyContent="flex-end">
    {/* Other items/components here */}

    {viewerIsOwner && name !== "+" && (
      <Grid item>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary[200],
            zIndex: 1,
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
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => handlePlaylistEdit(id)}>
            <EditIcon sx={{ mr: 0 }} /> Edit
          </MenuItem>
          <MenuItem onClick={handlePlaylistDelete}>
            <DeleteIcon sx={{ mr: 0 }} /> Delete
          </MenuItem>
        </Menu>
      </Grid>
    )}
  </Grid>
</>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item onClick={() => handlePlaylistClick(id)} sx={{
                      '&:hover': {
                        cursor: 'pointer'
                      },
                    }} lg={true}  md={true} sm={true} xs={true} >
                      <Typography sx={{ fontSize: '1.5rem', fontWeight: 500, mr: 0, mt: 0, mb: 0.75 }}>{name}</Typography>
                    </Grid>
                    <Grid item>

                    
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sx={{ mb: 1.25, '&:hover': {
                  cursor: 'pointer',
                }, }} onClick={() => handlePlaylistClick(id)} >
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: theme.palette.primary[200],
                      maxWidth: '44rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
        <DeleteConfirmationModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onDeleteConfirmed={handleDeleteConfirmed}
        />
    </>
  );
};

PlaylistCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default PlaylistCard;
