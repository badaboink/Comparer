// assets
import { IconMusic, IconPlus, IconFileMusic } from '@tabler/icons';

// constant
const icons = { IconMusic, IconPlus, IconFileMusic };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const song = {
  id: 'songs',
  title: 'Songs',
  type: 'group',
  children: [
    {
      id: 'all-songs',
      title: 'All songs',
      type: 'item',
      url: '/songs',
      icon: icons.IconMusic,
      breadcrumbs: false
    },
    {
      id: 'my-songs',
      title: 'My songs',
      type: 'item',
      url: '/my-songs',
      icon: icons.IconFileMusic,
      breadcrumbs: false
    },
    {
      id: 'add-song',
      title: 'Add new song',
      type: 'item',
      url: '/song/new',
      icon: icons.IconPlus,
      breadcrumbs: false
    },
  ]
};

export default song;