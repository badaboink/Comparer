import { 
    useEffect, 
    useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

// material-ui
import { Grid, Typography, ButtonBase, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import SongCard from '../song/SongCard';
import SongCardShort from '../song/SongCardShort';
import { alternateGridSpacing } from 'store/constant';
import Footer from '../../../layout/MainLayout/Footer/index';
import {PLAYLIST_SONG_URL, PLAYLIST_URL, ERROR_PAGE} from '../../../apiUrls';
import {isLoggedIn, isOwner} from '../../logic';
import DeleteConfirmationModal from '../../../ui-component/DeleteConfirmationModal';

// assets
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const PlaylistSongs = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlistData, setPlaylistData] = useState([]);
  const [songData, setSongsData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const userIsLoggedIn = isLoggedIn();
  const [userIsOwner, setUserIsOwner] = useState([]);
  const fetchData = async (songId) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const playlistResponse = await fetch(PLAYLIST_URL+"/"+id, {
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
      setUserIsOwner(isOwner(responseData.playlist.playlist_owner.username));
      
      const songUrl = PLAYLIST_SONG_URL.replace(':id', id);
      const songResponse = await fetch(songUrl, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });
      const responseData2 = await songResponse.json();
      if (songResponse.status === 200) {
        if (responseData.success) {
          setSongsData(responseData2.song);
          if(songId!=null)
          {
            const prevData = responseData.song.filter(song => song.id !== songId);
            setSongsData(prevData);
          }
        }
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    }
    finally{
      setLoading(false);
    }
  };
  const handlePlaylistEdit = (id) =>{
    navigate(`/playlist/${id}`);
  };
  const handlePlaylistDelete = () => {
    setDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };
  // const handlePlaylistDelete = (id) =>{
  //   const deleteData = async () => {
  //     try {
  //       const headers = {
  //         'Authorization': 'Bearer ' + localStorage.getItem('token'),
  //         'Content-Type': 'application/json',
  //       };
  //       await fetch(PLAYLIST_URL+"/"+id, {
  //         withCredentials: true,
  //         method: 'DELETE',
  //         credentials: 'include',
  //         headers: headers,
  //       });
  //     }catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   deleteData();
  //   navigate(-1);
  // };
  const handleDeleteConfirmed = () =>{
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
      }catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    deleteData();
    navigate(-1);
  }

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
          <h1>{playlistData.name}</h1>
        </Grid>
        {userIsOwner && (
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
              onClick={() =>handlePlaylistEdit(id)}
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
              onClick={() =>handlePlaylistDelete()}
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
                    {playlistData.description}
                  </Typography>
        </Grid>
      </Grid>
    <Grid container >
      {userIsOwner && (
        <Grid item lg={12} md={12} sm={12} xs={12}>
        <SongCardShort name={"+ Add song"} link={`/playlist/${id}/song/${"new"}`}/>
        </Grid> 
      )}
      <Grid item xs={12} mt={"0.5rem"}>
        <Grid container spacing={alternateGridSpacing}>
        {songData.map((song, index) => (
          <Grid item key={index} lg={12} md={12} sm={12} xs={12}>
          <SongCard index={index} name={song.name} playlistOwner={userIsOwner} id={song.id} fetchData={fetchData} isLoading={isLoading} artist={song.artist}
          songOwner={isOwner(song.song_owner.username)} year={song.year} pk={id} image={song.artwork}/>
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

export default PlaylistSongs;
