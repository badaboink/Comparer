import { 
    useEffect, 
    useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

// material-ui
import { Grid, Typography, ButtonBase, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import PlaylistCard from '../playlist/PlaylistCard';
import { alternateGridSpacing } from 'store/constant';
import Footer from '../../../layout/MainLayout/Footer/index';
import {CATEGORY_PLAYLIST_URL, CATEGORY_URL, ERROR_PAGE} from '../../../apiUrls';
import {isLoggedIn, isAdmin} from '../../../views/logic';
import DeleteConfirmationModal from '../../../ui-component/DeleteConfirmationModal';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CategoryPlaylist = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlistData, setPlaylistData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  
  const userIsLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  const fetchData = async (playlistId) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const playlistUrl = CATEGORY_PLAYLIST_URL.replace(':id', id);
      const playlistResponse = await fetch(playlistUrl, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await playlistResponse.json();
      if (playlistResponse.status === 200) {
        if (responseData.success) {
          setPlaylistData(responseData.playlist);
          if(playlistId!=null)
          {
            const prevData = responseData.playlist.filter(playlist => playlist.id !== playlistId);
            setPlaylistData(prevData);
          }
        }
      }
      const categoryResponse = await fetch(CATEGORY_URL+"/"+id, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });
      const responseData2 = await categoryResponse.json();
      if (categoryResponse.status === 200) {
        if (responseData.success) {
          setCategoryData(responseData2.category);
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally{
      setLoading(false);
    }
  };
  const handleCategoryEdit = (id) =>{
    navigate(`/category/${id}`);
  };
  const handleCategoryDelete = () => {
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
    navigate(`/dashboard`);
  };

  useEffect(() => {
    if(isLoggedIn())
    {
      fetchData(null);
    }
    if(!userIsLoggedIn)
    {
      window.location.href = ERROR_PAGE;
      return null;
    }
  }, []);
  
  return (
    <>
    {userIsLoggedIn && (
      <>
      <Grid container>
        <Grid item lg={11} md={11} sm={11} xs={11}>
          <h1>{categoryData.name}</h1>
        </Grid>
        {userIsAdmin && (
        <>
        <Grid item lg={true} md={0.5} sm={0.5} xs={0.5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: 2 }}>
          <ButtonBase sx={{ borderRadius: '12px' }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                  background: theme.palette.primary.dark,
                  color: theme.palette.primary.light
                }
              }}
              color="inherit"
              onClick={() =>handleCategoryEdit(id)}
            >
              <EditIcon stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Grid>
        <Grid item lg={true} md={0.5} sm={0.5} xs={0.5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <ButtonBase sx={{ borderRadius: '12px' }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                '&[aria-controls="menu-list-grow"],&:hover': {
                  background: theme.palette.primary.dark,
                  color: theme.palette.primary.light
                }
              }}
              color="inherit"
              onClick={() =>handleCategoryDelete(id)}
            >
              <DeleteIcon stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        </Grid>
        </>)}
        <Grid item lg={12} md={12} sm={12} xs={12} mb="1rem">
        <Typography
                    sx={{
                      fontSize: '1.3rem',
                      fontWeight: 500,
                      color: theme.palette.grey[500],
                      maxWidth: '44rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {categoryData.description}
                  </Typography>
        </Grid>
      </Grid>
    <Grid container >
      <Grid item lg={12} md={12} sm={12} xs={12}>
          <PlaylistCard name={"+"} description={"Add new playlist"} isAdmin={false} isLoading={isLoading} link={`/category/${id}/playlist/${"new"}`}/>
        </Grid> 
      <Grid item xs={12} mt={"0.5rem"}>
        <Grid container spacing={alternateGridSpacing}>
        {playlistData.map((playlist, index) => (
          <Grid item key={index} lg={12} md={12} sm={12} xs={12}>
          <PlaylistCard name={playlist.name} description={playlist.description} isAdmin={userIsAdmin} id={playlist.id} fetchData={fetchData} 
          isLoading={isLoading} owner={playlist.playlist_owner.username} link={`/playlist/${playlist.id}/song`}/>
          </Grid> 
        ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <Footer/>
      </Grid>
    </Grid>
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

export default CategoryPlaylist;
