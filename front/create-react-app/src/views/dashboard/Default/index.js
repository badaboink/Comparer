import { useEffect, useState } from 'react';

// slide
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

// project imports
import CategoryCard from './CategoryCard';
import { gridSpacing } from 'store/constant';
import Footer from '../../../layout/MainLayout/Footer/index';
import {CATEGORY_URL} from '../../../apiUrls';
import {isLoggedIn, isAdmin} from '../../../views/logic';
import mcr from "../../../assets/images/slide/mcr.jpg";
import alexg from "../../../assets/images/slide/alexg.jpg";
import clairo from "../../../assets/images/slide/clairo.jpg";
import dg from "../../../assets/images/slide/dg.jpg";
import mitski from "../../../assets/images/slide/mitski.jpg";
import sonic from "../../../assets/images/slide/sonic.jpg";
import logo from "../../../assets/images/logo/logo_alt.png";
import config from "../../../config";

const imageMap = [
  {
    "image": alexg,
    "caption1": "Join NOW and discover",
    "caption2": "your favorite new music!"
  },
  {
    "image": sonic,
    "caption1": "",
    "caption2": ""
  },
  {
    "image": clairo,
    "caption1": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA!",
    "caption2": ""
  },
  {
    "image": mcr,
    "caption1": "",
    "caption2": ""
  },
  {
    "image": dg,
    "caption1": "Share music",
    "caption2": "you LOVE...",
  },
  {
    "image": mitski,
    "caption1": "",
    "caption2": ""
  }
]

const buttonStyle = {
  width: "15rem",
  height: "15rem",
  background: 'none',
  border: '0px',
};

const properties = {
  prevArrow: <button style={{ ...buttonStyle }}><svg viewBox="0 0 512 512" fill="#fff"></svg></button>,
  nextArrow: <button style={{ ...buttonStyle }}><svg viewBox="0 0 512 512" fill="#fff"></svg></button>
}

const Dashboard = () => {
  const theme = useTheme();

  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [newWidth, setNewWidth] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
    if(window.innerWidth > 1920/2-30)
    {
      const math = 100.5-(1920-window.innerWidth)/16;
      setNewWidth(math + "rem");
    }
    else{
      const math = 115-(1920-window.innerWidth)/16;
      setNewWidth(math + "rem");
    }
  };
  
  
  const userIsLoggedIn = isLoggedIn();
  const userIsAdmin = isAdmin();
  const fetchData = async (id) => {
    try {
      const headers = {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      };

      const categoryResponse = await fetch(CATEGORY_URL, {
        withCredentials: true,
        method: 'GET',
        credentials: 'include',
        headers: headers,
      });

      const responseData = await categoryResponse.json();
      if (categoryResponse.status === 200) {
        if (responseData.success) {
          setCategoryData(responseData.category);
          if(id!=null)
          {
            const prevData = responseData.category.filter(category => category.id !== id);
            setCategoryData(prevData);
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
    window.addEventListener('resize', updateWindowWidth);
    return () => {
      window.removeEventListener('resize', updateWindowWidth);
    };

  }, []);

  const currentStyle = {
    height: '44rem',
    margin: '0 auto',
    width: windowWidth < 1920 ? newWidth
          : '100.5rem',
  };

  return (
    <>
    {userIsLoggedIn && (
      <><h1>Categories</h1>
      
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12} mt={"1rem"}>
        <Grid container spacing={gridSpacing}>
        {userIsAdmin &&(
        <Grid item lg={3} md={6} sm={6} xs={12}>
          <CategoryCard name={"+"} description={"Add new category"} isLoading={isLoading} isAdmin={false} id={"new"}/>
        </Grid> )}
        {categoryData.map((category, index) => (
          <Grid item key={index} lg={3} md={6} sm={6} xs={12}>
          <CategoryCard name={category.name} description={category.description} isLoading={isLoading} isAdmin={userIsAdmin} id={category.id} fetchData={fetchData}/>
          </Grid> 
        ))}
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <Footer/>
      </Grid>
    </Grid></>)}
    {!userIsLoggedIn && (
      <Grid container spacing={gridSpacing}>
        <Grid item lg={12} md={8} sm={6} xs={3}>
          <div style={currentStyle}>
          <Slide {...properties}>
              {imageMap.map((item, index) => (
              <div key={index} className="each-slide-effect">
                <div style={{ 'backgroundImage': `url(${item.image})` }}>
                  {item.caption1!="" &&
                    <span>{item.caption1} <br/> {item.caption2}
                    </span>
                  }
                  {item.caption1==="" &&
                  <center>
                      <Grid container alignItems="center">
                        <Grid item xs={12}>
                          <img src={logo} alt={"logo"} style={{ width: '50%' }} />
                        </Grid>
                        <Grid item xs={12}>
                          <p style={{ fontFamily: config.fontFamily, 
                            fontSize: "2rem", 
                            color: theme.palette.secondary.main, }}>
                            <b>MUSE.on</b>
                          </p>
                        </Grid>
                    </Grid>
                  </center>
                  }
                </div>
              </div>
            ))}
          </Slide>

          
          
          </div>
        </Grid> 
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
        <Footer/>
        </Grid>
      </Grid>
    )}
    </>
  );
};

export default Dashboard;
