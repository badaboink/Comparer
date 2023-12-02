import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonCategoryCard from 'ui-component/cards/Skeleton/CategoryCard';
import DeleteConfirmationModal from '../../../ui-component/DeleteConfirmationModal';

// assets
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  CATEGORY_URL } from 'apiUrls';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
  transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.secondary.main})`,
  },
}));

// ===========================|| DASHBOARD DEFAULT - Category CARD ||=========================== //

const CategoryCard = ({ name, description, isLoading, isAdmin, id, fetchData }) => {
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
  const handleDelete = () => {
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

        await fetch(CATEGORY_URL+"/"+id, {
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
  
  const handleCategoryClick = (id) =>{
    if(id==="new")
    {
      navigate(`/category/${id}`);
    }
    else
    {
      navigate(`/category/${id}/playlist`);
    }
  };
  const handleCategoryEdit = (id) =>{
    navigate(`/category/${id}`);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonCategoryCard />
      ) : (
        <>
        <CardWrapper border={false} content={false} sx={{ maxWidth: '44rem', overflow: 'hidden' }}>
          <Box sx={{ p: 2.25, height: '18rem' }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item>
                  </Grid>
                  <>
                  {isAdmin && (
                    <Grid item>
                      <Avatar
                        variant="rounded"
                        sx={{
                          ...theme.typography.commonAvatar,
                          ...theme.typography.mediumAvatar,
                          backgroundColor: theme.palette.secondary.dark,
                          color: theme.palette.secondary[200],
                          zIndex: 1
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
                        <MenuItem onClick={() =>handleCategoryEdit(id)}>
                          <EditIcon sx={{ mr: 1.75 }} /> Edit
                        </MenuItem>
                        <MenuItem onClick={handleDelete}>
                          <DeleteIcon sx={{ mr: 1.75 }} /> Delete
                        </MenuItem>
                      </Menu>
                    </Grid>
                    )}
                  </>
                </Grid>
              </Grid>
              <Grid 
              onClick={() => handleCategoryClick(id)} sx={{
                '&:hover': {
                  cursor: 'pointer',
                },
              }}>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 9, mb: 0.75 }}>{name}</Typography>
                    </Grid>
                    <Grid item>
                      
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sx={{ mb: 1.25 }}>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: theme.palette.secondary[200],
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
      )}
    </>
  );
};

CategoryCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

export default CategoryCard;
