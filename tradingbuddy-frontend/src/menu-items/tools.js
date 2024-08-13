// assets
import { LineChartOutlined, InsertRowAboveOutlined, RocketOutlined, TableOutlined } from '@ant-design/icons';
import TimelineIcon from '@mui/icons-material/Timeline';
import GridViewIcon from '@mui/icons-material/GridView';
import LinkIcon from '@mui/icons-material/Link';
import CalculateIcon from '@mui/icons-material/Calculate';
import TodayIcon from '@mui/icons-material/Today';

// icons
const icons = {
  LineChartOutlined,
  InsertRowAboveOutlined,
  RocketOutlined,
  TableOutlined,
  TimelineIcon,
  GridViewIcon,
  LinkIcon,
  CalculateIcon,
  TodayIcon
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const tool = {
  id: 'tool',
  title: 'Tools',
  type: 'group',
  children: [
    {
      id: 'stockdailyscores',
      title: 'Stock Daily Scores',
      type: 'item',
      url: '/stockdailyscores',
      icon: icons.LineChartOutlined
    },
    {
      id: 'stockvaluation',
      title: 'Stock Valuation Scores',
      type: 'item',
      url: '/stockvaluation',
      icon: icons.LineChartOutlined
    },
    {
      id: 'forexdailyscores',
      title: 'Forex & Index Daily Scores',
      type: 'item',
      url: '/forexdailyscores',
      icon: icons.LineChartOutlined
    },
    {
      id: 'imagematching',
      title: 'Image Matching',
      type: 'item',
      url: '/imagematching',
      icon: icons.LineChartOutlined
    },
    {
      id: 'linear-regression',
      title: 'Linear Regression',
      type: 'item',
      url: '/linear-regression',
      icon: icons.LineChartOutlined
    },
    {
      id: 'fxbot',
      title: 'Bot Buddy Results',
      type: 'item',
      url: '/fxbot',
      icon: icons.LineChartOutlined
    },
    {
      id: 'fxmt4dca',
      title: 'Forex Bot Recap',
      type: 'item',
      url: '/fxmt4dca',
      icon: icons.InsertRowAboveOutlined
    },
    {
      id: 'fxdcainsights',
      title: 'Forex Bot Insights',
      type: 'item',
      url: '/fxdcainsights',
      icon: icons.LineChartOutlined
    },
    {
      id: 'tvindicator',
      title: 'TradingView Charts',
      type: 'item',
      icon: icons.GridViewIcon,
      children: [
        {
          title: 'FX',
          children: [
            {
              title: 'Currency Strength',
              id: 'DXY',
              icon: icons.LinkIcon
            },
            {
              title: 'AUDCAD',
              id: 'AUDCAD',
              icon: icons.LinkIcon
            },
            {
              title: 'AUDCHF',
              id: 'AUDCHF',
              icon: icons.LinkIcon
            },
            {
              title: 'AUDJPY',
              id: 'AUDJPY',
              icon: icons.LinkIcon
            },
            {
              title: 'AUDNZD',
              id: 'AUDNZD',
              icon: icons.LinkIcon
            },
            {
              title: 'AUDUSD',
              id: 'AUDUSD',
              icon: icons.LinkIcon
            },
            {
              title: 'CADCHF',
              id: 'CADCHF',
              icon: icons.LinkIcon
            },
            {
              title: 'CADJPY',
              id: 'CADJPY',
              icon: icons.LinkIcon
            },
            {
              title: 'CHFJPY',
              id: 'CHFJPY',
              icon: icons.LinkIcon
            },
            {
              title: 'EURAUD',
              id: 'EURAUD',
              icon: icons.LinkIcon
            },
            {
              title: 'EURCAD',
              id: 'EURCAD',
              icon: icons.LinkIcon
            },
            {
              title: 'EURCHF',
              id: 'EURCHF',
              icon: icons.LinkIcon
            },
            {
              title: 'EURJPY',
              id: 'EURJPY',
              icon: icons.LinkIcon
            },
            {
              title: 'EURNZD',
              id: 'EURNZD',
              icon: icons.LinkIcon
            },
            {
              title: 'EURUSD',
              id: 'EURUSD',
              icon: icons.LinkIcon
            },
            {
              title: 'GBPAUD',
              id: 'GBPAUD',
              icon: icons.LinkIcon
            },
            {
              title: 'GBPCAD',
              id: 'GBPCAD',
              icon: icons.LinkIcon
            },
            {
              title: 'GBPCHF',
              id: 'GBPCHF',
              icon: icons.LinkIcon
            },
            {
              title: 'GBPJPY',
              id: 'GBPJPY',
              icon: icons.LinkIcon
            },
            {
              title: 'GBPNZD',
              id: 'GBPNZD',
              icon: icons.LinkIcon
            },
            {
              title: 'GBPUSD',
              id: 'GBPUSD',
              icon: icons.LinkIcon
            },
            {
              title: 'GOLD',
              id: 'GOLD',
              icon: icons.LinkIcon
            },
            {
              title: 'NZDCAD',
              id: 'NZDCAD',
              icon: icons.LinkIcon
            },
            {
              title: 'NZDCHF',
              id: 'NZDCHF',
              icon: icons.LinkIcon
            },
            {
              title: 'NZDJPY',
              id: 'NZDJPY',
              icon: icons.LinkIcon
            },
            {
              title: 'NZDUSD',
              id: 'NZDUSD',
              icon: icons.LinkIcon
            },
            {
              title: 'USDCAD',
              id: 'USDCAD',
              icon: icons.LinkIcon
            },
            {
              title: 'USDCHF',
              id: 'USDCHF',
              icon: icons.LinkIcon
            },
            {
              title: 'USDJPY',
              id: 'USDJPY',
              icon: icons.LinkIcon
            }
          ]
        },
        {
          title: 'Stocks',
          children: [
            {
              title: 'AMAZON',
              id: 'AMAZON',
              icon: icons.LinkIcon
            },
            {
              title: 'AMD',
              id: 'AMD',
              icon: icons.LinkIcon
            },
            {
              title: 'APPLE',
              id: 'APPLE',
              icon: icons.LinkIcon
            },
            {
              title: 'COCA-COLA',
              id: 'COCA-COLA',
              icon: icons.LinkIcon
            },
            {
              title: 'GOOGLE',
              id: 'GOOGLE',
              icon: icons.LinkIcon
            },
            {
              title: 'INTEL',
              id: 'INTEL',
              icon: icons.LinkIcon
            },
            {
              title: 'JNJ',
              id: 'JNJ',
              icon: icons.LinkIcon
            },
            {
              title: 'META',
              id: 'META',
              icon: icons.LinkIcon
            },
            {
              title: 'MICROSOFT',
              id: 'MICROSOFT',
              icon: icons.LinkIcon
            },
            {
              title: 'MODERNA',
              id: 'MODERNA',
              icon: icons.LinkIcon
            },
            {
              title: 'NETFLIX',
              id: 'NETFLIX',
              icon: icons.LinkIcon
            },
            {
              title: 'NIO',
              id: 'NIO',
              icon: icons.LinkIcon
            },
            {
              title: 'NVIDIA',
              id: 'NVIDIA',
              icon: icons.LinkIcon
            },
            {
              title: 'PFIZER',
              id: 'PFIZER',
              icon: icons.LinkIcon
            },
            {
              title: 'QQQ',
              id: 'QQQ',
              icon: icons.LinkIcon
            },
            {
              title: 'SHOPIFY',
              id: 'SHOPIFY',
              icon: icons.LinkIcon
            },
            {
              title: 'SPY',
              id: 'SPY',
              icon: icons.LinkIcon
            },
            {
              title: 'SQUARE',
              id: 'SQUARE',
              icon: icons.LinkIcon
            },
            {
              title: 'TESLA',
              id: 'TESLA',
              icon: icons.LinkIcon
            }
          ]
        },
        {
          title: 'Crypto',
          children: [
            {
              title: 'BITCOIN',
              id: 'BITCOIN',
              icon: icons.LinkIcon
            },
            {
              title: 'ETHEREUM',
              id: 'ETHEREUM',
              icon: icons.LinkIcon
            }
          ]
        }
      ]
    },
    {
      id: 'orders',
      title: 'Order Tables',
      type: 'item',
      url: '/openorders',
      icon: icons.TableOutlined
    },
    {
      id: 'charttrendsmatrix',
      title: 'Chart Trends Matrix',
      type: 'item',
      url: '/charttrendsmatrix',
      icon: icons.TimelineIcon
    },
    {
      id: 'patterncalculator',
      title: 'Pattern Trade Calculator',
      type: 'item',
      url: '/patterncalculator',
      icon: icons.CalculateIcon
    },
    {
      id: 'riskcalculator',
      title: 'Risk Trade Calculator',
      type: 'item',
      url: '/riskcalculator',
      icon: icons.CalculateIcon
    },
    {
      id: 'earningcalendar',
      title: 'Earning Calendar',
      type: 'item',
      url: '/earningcalendar',
      icon: icons.TodayIcon
    }
  ]
};

export default tool;
