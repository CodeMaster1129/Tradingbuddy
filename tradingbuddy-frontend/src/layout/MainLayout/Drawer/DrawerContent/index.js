// project import
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = () => (
  <SimpleBar
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#1e222d',
        borderRight: '1px solid #434651 '
      }
    }}
  >
    <Navigation />
    {/* <NavCard /> */}
  </SimpleBar>
);

export default DrawerContent;
