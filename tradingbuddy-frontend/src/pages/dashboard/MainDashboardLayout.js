import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Responsive, WidthProvider } from 'react-grid-layout';
import TradingViewMainChartWidget from './TradingViewMainChartWidget';
import TechnicalGuage from './TechnicalGuage';
import DashInsiderActivity from './DashInsiderActivity';
import './style/mainDashboardLayout.css';
import './style/styles.css';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const layout = [
  { i: '0', x: 0, y: 0, w: 6, h: 9 },
  { i: '1', x: 0, y: 9, w: 6, h: 2 },
  { i: '2', x: 0, y: 11, w: 1, h: 10 },
  { i: '3', x: 1, y: 11, w: 3, h: 5 },
  { i: '4', x: 1, y: 16, w: 3, h: 5 },
  { i: '5', x: 4, y: 11, w: 2, h: 3 },
  { i: '6', x: 4, y: 14, w: 2, h: 7 },
  { i: '7', x: 6, y: 11, w: 3, h: 5 },
  { i: '8', x: 6, y: 16, w: 3, h: 5 },
  { i: '9', x: 6, y: 4, w: 3, h: 7 },
  { i: '10', x: 6, y: 0, w: 3, h: 4 },
  { i: '11', x: 9, y: 7, w: 2, h: 10 },
  { i: '12', x: 9, y: 17, w: 2, h: 4 },
  { i: '13', x: 9, y: 0, w: 2, h: 7 },
  { i: '14', x: 11, y: 0, w: 1, h: 21 }
];

export default class MainDashboardLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBreakpoint: 'lg',
      compactType: 'vertical',
      mounted: false,
      layouts: { lg: layout }
    };

    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onCompactTypeChange = this.onCompactTypeChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onNewLayout = this.onNewLayout.bind(this);
  }

  componentDidMount() {
    this.setState({ mounted: true });
  }

  generateDOM() {
    return _.map(this.state.layouts.lg, (l, i) => {
      const gridItemProps = {
        key: i,
        className: 'grid-item',
        'data-grid': l
      };

      if (i === 0) {
        return (
          <div key={i} {...gridItemProps}>
            <TradingViewMainChartWidget />
          </div>
        );
      }
      if (i === 3) {
        return (
          <div key={i} {...gridItemProps}>
            <DashInsiderActivity symbol={this.state.searchItem} />
          </div>
        );
      }
      if (i === 7) {
        return (
          <div key={i} {...gridItemProps}>
            <TechnicalGuage />
          </div>
        );
      } else {
        return (
          <div key={i} {...gridItemProps}>
            {`Widget ${i}`}
          </div>
        );
      }
    });
  }

  onBreakpointChange(breakpoint) {
    this.setState({
      currentBreakpoint: breakpoint
    });
  }

  onCompactTypeChange() {
    const { compactType: oldCompactType } = this.state;
    const compactType = oldCompactType === 'horizontal' ? 'vertical' : oldCompactType === 'vertical' ? null : 'horizontal';
    this.setState({ compactType });
  }

  onLayoutChange(layout, layouts) {
    this.props.onLayoutChange(layout, layouts);
  }

  onNewLayout() {
    this.setState({
      layouts: { lg: layout }
    });
  }

  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '10px' }}>
          <h1>Dashboard</h1>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Paper
              component="form"
              sx={{ p: '2px', display: 'flex', alignItems: 'center', width: 200 }}
              style={{ marginRight: '10px' }}
              onChange={(e) => {
                this.setState({ searchItem: e.target.value });
              }}
            >
              <IconButton type="button" sx={{ p: '10px' }} aria-label="Symbol">
                <SearchIcon />
              </IconButton>
              <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Symbol" inputProps={{ 'aria-label': 'search google maps' }} />
            </Paper>
            <Button variant="contained" style={{ marginRight: '10px' }}>
              Submit
            </Button>
          </div>
        </div>
        <ResponsiveReactGridLayout
          {...this.props}
          layouts={this.state.layouts}
          onBreakpointChange={this.onBreakpointChange}
          onLayoutChange={this.onLayoutChange}
          measureBeforeMount={false}
          useCSSTransforms={this.state.mounted}
          compactType={this.state.compactType}
          preventCollision={!this.state.compactType}
        >
          {this.generateDOM()}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}

MainDashboardLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
};

MainDashboardLayout.defaultProps = {
  className: 'layout',
  rowHeight: 30,
  onLayoutChange: function () {},
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: layout
};
