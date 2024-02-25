import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@mui/material';

const BoardDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const theme = useTheme();
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsOpen(open);
  };

  const list = () => (
    <Box role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className="board-drawer">
      <Box
        className="drawer-bar"
        sx={{
          position: 'fixed',
          width: 10,
          height: '95%',
          margin: '20px 0',
          cursor: 'pointer',
          backgroundColor: `${theme.palette.mode === 'dark' ? 'var(--white02)' : 'var(--black02)'}`,
          borderTopRightRadius: '10px',
          borderBottomRightRadius: '10px',
          ':hover': {
            width: 15,
            boxShadow: '0px 0px 10px 0px var(--black02)',
          },
          transition: 'all 0.3s ease',
        }}
        onClick={toggleDrawer(true)}
      ></Box>

      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '-5px',
          width: 30,
          height: 30,
          borderRadius: '50%',
          bgcolor: theme.palette.mode === 'dark' ? 'var(--white03)' : 'var(--black03)',
          cursor: 'pointer',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          ':hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <ChevronRight
          color={theme.palette.mode === 'dark' ? 'var(--primary-dark)' : 'white'}
          strokeWidth={3}
          size={25}
          onClick={toggleDrawer(true)}
        />
      </Box>

      <SwipeableDrawer
        anchor={'left'}
        open={isOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </Box>
  );
};

export default BoardDrawer;
