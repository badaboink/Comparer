import dashboard from './dashboard';
import playlist from './playlists';
import song from './songs';
// import log from './log';
// import pages from './pages';
// import utilities from './utilities';
// import other from './other';
import {isLoggedIn} from '../views/logic';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    dashboard, 
    isLoggedIn() ? playlist : null,
    isLoggedIn() ? song : null,
    // log,
    // pages, 
    // utilities, 
    // other
  ].filter(Boolean),
};

export default menuItems;
