// assets
import { IconKey, IconUser } from '@tabler/icons';

// constant
const icons = {
  IconKey,
  IconUser
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const log = {
    id: 'log',
    type: 'group',
    children: [
      {
        id: 'sign-in',
        title: 'Sign in',
        type: 'item',
        url: '/pages/login',
        icon: icons.IconUser,
        breadcrumbs: false
      },
      {
        id: 'documentation',
        title: 'Documentation',
        type: 'item',
        url: 'https://codedthemes.gitbook.io/berry/',
        icon: icons.IconHelp,
        external: true,
        target: true
      }
    ]
  };

export default log;
