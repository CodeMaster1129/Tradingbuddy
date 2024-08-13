/* eslint-disable */
import PropTypes from 'prop-types';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardControlKeyIcon from '@mui/icons-material/KeyboardControlKey';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import LinkIcon from '@mui/icons-material/Link';
import axios from 'axios';
import { toast } from 'react-toastify';

// project import
import { activeItem } from 'store/reducers/menu';

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { drawerOpen, openItem } = useSelector((state) => state.menu);

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = { component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />) };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }

  const itemHandler = (id) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const Icon = item.icon;
  const itemIcon = item.icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : false;

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;
  // active menu item on page load
  useEffect(() => {
    if (pathname.includes(item.url)) {
      dispatch(activeItem({ openItem: [item.id] }));
    }
    // eslint-disable-next-line
  }, [pathname]);

  const textColor = 'text.white';
  const iconSelectedColor = 'primary.white';

  const getLinks = async (symbol) => {
    var bodyFormData = new FormData();
    bodyFormData.append('symbol', symbol);
    await axios({
      method: 'post',
      url: `${process.env.REACT_APP_API_URL}/activity/gettradingviewurl`,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then((res) => {
      if (res.status === 200) {
        window.open(res.data[0][0]);
        toast.success(`Open ${symbol} TradingViewPage!!!`);
      }
    });
  };

  return (
    <>
      {item.children ? (
        <TreeView
          aria-label={'menu'}
          defaultCollapseIcon={<KeyboardControlKeyIcon />}
          defaultExpandIcon={<KeyboardArrowDownIcon />}
          sx={{ height: 'auto', flexGrow: 1, maxWidth: 400, overflowY: 'auto', color: '#8ba3b1' }}
        >
          <TreeItem
            nodeId="item.id"
            label={
              <ListItemButton
                {...listItemProps}
                disabled={item.disabled}
                onClick={() => itemHandler(item.id)}
                selected={isSelected}
                sx={{
                  zIndex: 1201,
                  py: !drawerOpen && level === 1 ? 1.25 : 1,
                  ...(drawerOpen && {
                    '&:hover': {
                      bgcolor: 'primary.black'
                    },
                    '&.Mui-selected': {
                      bgcolor: 'primary.black',
                      borderRight: `2px solid #434651 `,
                      color: iconSelectedColor,
                      '&:hover': {
                        color: iconSelectedColor,
                        bgcolor: 'primary.black'
                      }
                    }
                  }),
                  ...(!drawerOpen && {
                    '&:hover': {
                      bgcolor: 'transparent'
                    },
                    '&.Mui-selected': {
                      '&:hover': {
                        bgcolor: 'transparent'
                      },
                      bgcolor: 'transparent'
                    }
                  })
                }}
              >
                {itemIcon && (
                  <ListItemIcon
                    sx={{
                      minWidth: 28,
                      color: isSelected ? 'green' : '#8ba3b1',
                      ...(!drawerOpen && {
                        borderRadius: 1.5,
                        width: 36,
                        height: 36,
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          bgcolor: 'secondary.lighter'
                        }
                      }),
                      ...(!drawerOpen &&
                        isSelected && {
                          bgcolor: 'primary.lighter',
                          '&:hover': {
                            bgcolor: 'primary.lighter'
                          }
                        })
                    }}
                  >
                    {itemIcon}
                  </ListItemIcon>
                )}
                {(drawerOpen || (!drawerOpen && level !== 1)) && (
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ color: '#8ba3b1', margin: '0px' }}>
                        {item.title}
                      </Typography>
                    }
                  />
                )}
                {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
                  <Chip
                    color={item.chip.color}
                    variant={item.chip.variant}
                    size={item.chip.size}
                    label={item.chip.label}
                    avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                  />
                )}
              </ListItemButton>
            }
          >
            {item.children.map((items, index) => (
              <TreeItem key={index} nodeId={index.toString()} label={items.title} sx={{ color: '#8ba3b1', padding: '7px' }}>
                {items.children &&
                  items.children.map((child, childIndex) => (
                    <TreeItem
                      key={childIndex}
                      nodeId={`${index}-${childIndex}`}
                      label={
                        <div
                          style={{ display: 'flex', alignItems: 'center' }}
                          onClick={() => {
                            getLinks(child.id);
                          }}
                        >
                          <LinkIcon style={{ width: '16px', height: '16px', marginRight: '5px' }} /> {/* Add your icon component here */}
                          <span style={{ color: '#1976d2' }}>{child.title}</span>
                        </div>
                      }
                      sx={{ color: '#8ba3b1', padding: '5px' }}
                    />
                  ))}
              </TreeItem>
            ))}
          </TreeItem>
        </TreeView>
      ) : (
        <ListItemButton
          {...listItemProps}
          disabled={item.disabled}
          onClick={() => itemHandler(item.id)}
          selected={isSelected}
          sx={{
            zIndex: 1201,
            pl: drawerOpen ? `${level * 28}px` : 1.5,
            py: !drawerOpen && level === 1 ? 1.25 : 1,
            ...(drawerOpen && {
              '&:hover': {
                bgcolor: 'primary.black'
              },
              '&.Mui-selected': {
                bgcolor: 'primary.black',
                borderRight: `2px solid #434651 `,
                color: iconSelectedColor,
                '&:hover': {
                  color: iconSelectedColor,
                  bgcolor: 'primary.black'
                }
              }
            }),
            ...(!drawerOpen && {
              '&:hover': {
                bgcolor: 'transparent'
              },
              '&.Mui-selected': {
                '&:hover': {
                  bgcolor: 'transparent'
                },
                bgcolor: 'transparent'
              }
            }),
            padding: item.id === 'dashboard' ? '10px 10px' : '7px 50px'
          }}
        >
          {itemIcon && (
            <ListItemIcon
              sx={{
                minWidth: 28,
                color: isSelected ? 'green' : '#8ba3b1',
                ...(!drawerOpen && {
                  borderRadius: 1.5,
                  width: 36,
                  height: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    bgcolor: 'secondary.lighter'
                  }
                }),
                ...(!drawerOpen &&
                  isSelected && {
                    bgcolor: 'primary.lighter',
                    '&:hover': {
                      bgcolor: 'primary.lighter'
                    }
                  })
              }}
            >
              {itemIcon}
            </ListItemIcon>
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && (
            <ListItemText
              primary={
                <Typography variant="h6" sx={{ color: '#8ba3b1', margin: '0px' }}>
                  {item.title}
                </Typography>
              }
            />
          )}
          {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
            <Chip
              color={item.chip.color}
              variant={item.chip.variant}
              size={item.chip.size}
              label={item.chip.label}
              avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
            />
          )}
        </ListItemButton>
      )}
    </>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number
};

export default NavItem;
