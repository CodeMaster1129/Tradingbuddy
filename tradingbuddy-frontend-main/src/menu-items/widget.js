// assets
import { DashboardOutlined, DeploymentUnitOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  DeploymentUnitOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const widget = {
  id: 'widget',
  title: 'Widgets',
  type: 'group',
  children: [
    {
      id: 'alerts',
      title: 'Alerts',
      type: 'item',
      url: '/alerts',
      icon: icons.DeploymentUnitOutlined
    },
    {
      id: 'screener',
      title: 'Screener',
      type: 'item',
      url: '/screener',
      icon: icons.DeploymentUnitOutlined
    },
    {
      id: 'irregular',
      title: 'Irregular Stock Activity',
      type: 'item',
      url: '/irregular',
      icon: icons.DeploymentUnitOutlined
    },
    {
      id: 'liveoptions',
      title: 'Live Options',
      type: 'item',
      url: '/liveoptions',
      icon: icons.DeploymentUnitOutlined
    },

    {
      id: 'stockheatmap',
      title: 'Stock Heatmap',
      type: 'item',
      url: '/stockheatmap',
      icon: icons.DeploymentUnitOutlined
    },

    {
      id: 'insideractivity',
      title: 'Insider Activity',
      type: 'item',
      url: '/insideractivity',
      icon: icons.DeploymentUnitOutlined
    },
    {
      id: 'splitactivity',
      title: 'Split Activity',
      type: 'item',
      url: '/splitactivity',
      icon: icons.DeploymentUnitOutlined
    },
    {
      id: 'economiccalendar',
      title: 'Economic Calendar',
      type: 'item',
      url: '/economiccalendar',
      icon: icons.DeploymentUnitOutlined
    },
    {
      id: 'item1',
      title: '',
      type: 'item'
    },
    {
      id: 'item2',
      title: '',
      type: 'item'
    },
    {
      id: 'item3',
      title: '',
      type: 'item'
    },
    {
      id: 'item4',
      title: '',
      type: 'item'
    }
  ]
};

export default widget;
