import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate } from 'react-router';
// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));
const MainDashboardLayout = Loadable(lazy(() => import('pages/dashboard/MainDashboard')));
const LinearRegression = Loadable(lazy(() => import('pages/LinearRegression')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
const MT4Tools = Loadable(lazy(() => import('pages/mt4tools/MT4Tools')));
const InsiderActivity = Loadable(lazy(() => import('pages/component-widget/InsiderActivity')));
const SpliteHistory = Loadable(lazy(() => import('pages/component-widget/SplitHistory')));
const StockHeatmap = Loadable(lazy(() => import('pages/component-widget/StockHeatmap')));
const EconomicCalendar = Loadable(lazy(() => import('pages/component-widget/EconomicCalendar')));
const Screener = Loadable(lazy(() => import('pages/component-widget/Screeners')));
const IrregularActivity = Loadable(lazy(() => import('pages/component-widget/IrregularActivity')));
const Alerts = Loadable(lazy(() => import('pages/component-widget/Alerts/Alerts')));
const Openorders = Loadable(lazy(() => import('pages/Openorders/Openorders')));
const FxDCATools = Loadable(lazy(() => import('pages/FxDCATools')));
const FxBotBuddyResults = Loadable(lazy(() => import('pages/FxBotBuddyResults')));
const StockDailyScores = Loadable(lazy(() => import('pages/StockDailyScores')));
const ForexIndexDailyScores = Loadable(lazy(() => import('pages/ForexIndexDailyScores')));
const StockValuationScores = Loadable(lazy(() => import('pages/StockValuationScores')));
const PatternCalculator = Loadable(lazy(() => import('pages/PatternCalculator/PatternCalculator')));
const RiskManagementCalculator = Loadable(lazy(() => import('pages/RiskManagementCalculator/RiskManagementCalculator')));
const EarningCalendar = Loadable(lazy(() => import('pages/EarningCalendar')));
const ChartTrendsMatrix = Loadable(lazy(() => import('pages/ChartTrendsMatrix/ChartTrendsMatrix')));
const LiveOptions = Loadable(lazy(() => import('pages/component-widget/LiveOptions')));

// const SelectComponent = Loadable(lazy(() => import('pages/mt4tools/Select')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <Navigate replace to="login" />
    },
    {
      path: '/dashboard',
      element: <MainDashboardLayout />
    },
    {
      path: '/imagematching',
      element: <DashboardDefault />
    },
    {
      path: '/stockdailyscores',
      element: <StockDailyScores />
    },
    {
      path: '/forexdailyscores',
      element: <ForexIndexDailyScores />
    },
    {
      path: '/stockvaluation',
      element: <StockValuationScores />
    },
    {
      path: '/fxbot',
      element: <FxBotBuddyResults />
    },
    {
      path: '/fxmt4dca',
      element: <MT4Tools />
    },
    {
      path: '/fxdcainsights',
      element: <FxDCATools />
    },
    {
      path: '/liveoptions',
      element: <LiveOptions />
    },
    {
      path: '/Openorders',
      element: <Openorders />
    },
    {
      path: '/Charttrendsmatrix',
      element: <ChartTrendsMatrix />
    },
    {
      path: '/patterncalculator',
      element: <PatternCalculator />
    },
    {
      path: '/riskcalculator',
      element: <RiskManagementCalculator />
    },
    {
      path: '/stockheatmap',
      element: <StockHeatmap />
    },
    {
      path: '/earningcalendar',
      element: <EarningCalendar />
    },
    {
      path: '/linear-regression',
      element: <LinearRegression />
    },
    {
      path: '/tableindicator',
      element: <></>
    },
    {
      path: '/insideractivity',
      element: <InsiderActivity />
    },
    {
      path: '/splitactivity',
      element: <SpliteHistory />
    },
    {
      path: '/levels',
      element: <></>
    },
    {
      path: '/technicalguage',
      element: <></>
    },
    {
      path: '/keyindicatorguage',
      element: <></>
    },
    {
      path: '/performancegrid',
      element: <></>
    },
    {
      path: '/economiccalendar',
      element: <EconomicCalendar />
    },
    {
      path: '/infodatawindow',
      element: <></>
    },
    {
      path: '/screener',
      element: <Screener />
    },
    {
      path: '/irregular',
      element: <IrregularActivity />
    },
    {
      path: '/alerts',
      element: <Alerts />
    },
    {
      path: '/mas',
      element: <></>
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'icons/ant',
      element: <AntIcons />
    }
  ]
};

export default MainRoutes;
