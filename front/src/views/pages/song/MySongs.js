import { 
    useEffect, 
    useState } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid} from '@mui/material';

// project imports
import SongCard from './SongCard';
import SongCardShort from './SongCardShort';
import { alternateGridSpacing } from 'store/constant';
import Footer from '../../../layout/MainLayout/Footer/index';
import {MY_SONGS_URL, ERROR_PAGE} from '../../../apiUrls';
import {isLoggedIn, getUsername} from '../../logic';

const MySong = () => {
  const { id } = useParams();

  const [songData, setSongsData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  const userIsLoggedIn = isLoggedIn();
  const username = getUsername();
  const fetchData = async (songId) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };
      const songResponse = await fetch(MY_SONGS_URL+"/"+username, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });
      const responseData = await songResponse.json();
      if (songResponse.status === 200) {
        if (responseData.success) {
          setSongsData(responseData.song);
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
          <h1>My songs</h1>
        </Grid>
      </Grid>
    <Grid container >
        <Grid item lg={12} md={12} sm={12} xs={12}>
        <SongCardShort name={"+ Add song"} link={`/song/${"new"}`}/>
        </Grid> 
      <Grid item xs={12} mt={"0.5rem"}>
        <Grid container spacing={alternateGridSpacing}>
        {songData.map((song, index) => (
          <Grid item key={index} lg={12} md={12} sm={12} xs={12}>
          <SongCard index={index} name={song.name} id={song.id} fetchData={fetchData} isLoading={isLoading} artist={song.artist}
          songOwner={song.song_owner.username} year={song.year} pk={id} image={song.artwork}/>
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

export default MySong;
