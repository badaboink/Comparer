import { 
    useEffect, 
    useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import PlaylistCard from './PlaylistCard';
import { alternateGridSpacing } from 'store/constant';
import Footer from '../../../layout/MainLayout/Footer/index';
import {MY_PLAYLIST_URL, ERROR_PAGE} from '../../../apiUrls';
import {isLoggedIn, isAdmin, getUsername} from '../../logic';


const MyPlaylists = () => {

  const [playlistData, setPlaylistData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  const userIsLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  const username = getUsername();
  
  const fetchData = async (id) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const playlistResponse = await fetch(`${MY_PLAYLIST_URL}/${encodeURIComponent(username)}`, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await playlistResponse.json();
      if (playlistResponse.status === 200) {
        if (responseData.success) {
          setPlaylistData(responseData.playlist);
          if(id!=null)
          {
            const prevData = responseData.playlist.filter(playlist => playlist.id !== id);
            setPlaylistData(prevData);
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
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <h1>My playlists</h1>
        </Grid>
      </Grid>
    <Grid container>
      <Grid item lg={12} md={12} sm={12} xs={12}>
          <PlaylistCard name={"+"} description={"Add new playlist"} isAdmin={false} isLoading={isLoading} link={`/playlist/${"new"}`}/>
        </Grid> 
      <Grid item xs={12} mt={"0.5rem"}>
        <Grid container spacing={alternateGridSpacing}>
        {playlistData.map((playlist, index) => (
          <Grid item key={index} lg={12} md={12} sm={12} xs={12}>
          <PlaylistCard name={playlist.name} description={playlist.description} isAdmin={userIsAdmin} id={playlist.id} fetchData={fetchData} isLoading={isLoading} owner={playlist.playlist_owner.username} link={`/playlist/${playlist.id}/song`}/>
          </Grid> 
        ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <Footer/>
      </Grid>
    </Grid>
    </>
    )}
    </>
  );
};

export default MyPlaylists;
