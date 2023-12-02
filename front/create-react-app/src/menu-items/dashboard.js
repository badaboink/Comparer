// assets
import { IconCategory } from '@tabler/icons';

// constant
const icons = { IconCategory };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Main page',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconCategory,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
