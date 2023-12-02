import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const Category = Loadable(lazy(() => import('views/pages/category/Category')));
const CategoryPlaylist = Loadable(lazy(() => import('views/pages/category/CategoryPlaylist')));
const ALLPlaylists = Loadable(lazy(() => import('views/pages/playlist/AllPlaylists')));
const Playlist = Loadable(lazy(() => import('views/pages/playlist/Playlist')));
const MyPlaylist = Loadable(lazy(() => import('views/pages/playlist/MyPlaylists')));
const PlaylistSongs = Loadable(lazy(() => import('views/pages/playlist/PlaylistSongs')));
const Song = Loadable(lazy(() => import('views/pages/song/Song')));
const AllSongs = Loadable(lazy(() => import('views/pages/song/AllSongs')));
const MySong = Loadable(lazy(() => import('views/pages/song/MySongs')));

// ==============================|| MAIN ROUTING ||============================== //

const ObjectRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'category/:id',
        element: <Category />,
      },
      {
        path: 'category/:id/playlist',
        element: <CategoryPlaylist />
      },
      {
        path: 'playlist',
        element: <ALLPlaylists />
      },
      {
        path: 'songs',
        element: <AllSongs />,
      },
      {
        path: 'playlist/:id',
        element: <Playlist />,
      },
      {
        path: 'category/:cd/playlist/:id',
        element: <Playlist />,
      },
      {
        path: 'my-playlists/',
        element: <MyPlaylist />,
      },
      {
        path: 'my-songs/',
        element: <MySong />,
      },
      {
        path: 'song/:id',
        element: <Song />,
      },
      {
        path: 'playlist/:cd/song/:id',
        element: <Song />,
      },
      {
        path: 'playlist/:id/song',
        element: <PlaylistSongs />,
      },
      
    ],
    
  };
  
  export default ObjectRoutes;
