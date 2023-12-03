// assets
import { IconPlaylist, IconHeart, IconPlus } from '@tabler/icons';

// constant
const icons = { IconPlaylist, IconHeart, IconPlus };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const playlist = {
  id: 'playlist',
  title: 'Playlists',
  type: 'group',
  children: [
    {
      id: 'all-playlists',
      title: 'All playlists',
      type: 'item',
      url: '/playlist',
      icon: icons.IconPlaylist,
      breadcrumbs: false
    },
    {
      id: 'my-playlists',
      title: 'My playlists',
      type: 'item',
      url: '/my-playlists',
      icon: icons.IconHeart,
      breadcrumbs: false
    },
    {
      id: 'create-new-playlist',
      title: 'Create new playlist',
      type: 'item',
      url: '/playlist/new',
      icon: icons.IconPlus,
      breadcrumbs: false
    }
  ]
};

export default playlist;