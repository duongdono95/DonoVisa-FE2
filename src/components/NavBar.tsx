import { AppBar, Avatar, Box, Button, InputAdornment, MenuItem, MenuList, TextField, Tooltip, useTheme } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/AppStore';
import Logo2 from '../assets/Logo2';
import { LogOut, Search, User2 } from 'lucide-react';
import { GUEST_ID } from '../types/GeneralTypes';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import BrightModeToggle from './BrightModeToggle';
import { GuestAccount } from '../utils/constants';
import { useBoardsStore } from '../stores/BoardsStore';
import { useDivSizeThroughRef } from '../hooks/GeneralHooks';

const NavBar = () => {
  const theme = useTheme();
  const appBarRef = useRef<HTMLDivElement>(null);
  const [user, setAppBarHeight] = useAppStore((state) => [state.user, state.setAppBarHeight]);
  const appBarHeight = useDivSizeThroughRef(appBarRef, 'height');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [setUser] = useAppStore((state) => [state.setUser]);
  const [setBoardList] = useBoardsStore((state) => [state.setBoardList]);
  useEffect(() => {
    appBarHeight && setAppBarHeight(appBarHeight);
  }, [appBarHeight]);
  return (
    user && (
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.mode === 'dark' ? 'var(--white02)' : 'white',
          boxShadow: `0 0 10px var(--black02)`,
        }}
      >
        <Box
          ref={appBarRef}
          className="AppBar"
          sx={{
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 2%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Logo2 />
          </Box>
          <TextField
            size="small"
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color={theme.palette.mode === 'dark' ? 'var(--white05)' : 'var(--black05)'} size={20} />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip
            title={
              user.firstName !== GUEST_ID ? (
                <MenuList>
                  <MenuItem sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <User2 size={20} />
                    {`${user.firstName} ${user?.lastName === 'firebase' ? '' : user?.lastName}`}
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      queryClient.invalidateQueries({ queryKey: ['boards'] });
                      setUser(GuestAccount);
                      setBoardList([]);
                      navigate('/');
                    }}
                    sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}
                  >
                    <LogOut size={20} />
                    Sign Out
                  </MenuItem>
                </MenuList>
              ) : undefined
            }
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <BrightModeToggle />
              {user && user.firstName === GUEST_ID ? (
                <Button onClick={() => navigate('/sign-in')} style={{ color: theme.palette.mode === 'dark' ? 'white' : 'var(--black07)' }}>
                  Sign In
                </Button>
              ) : (
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                  }}
                >
                  <b style={{ fontSize: 12 }}>
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName === 'firebase' ? '' : user.lastName.charAt(0).toUpperCase()}
                  </b>
                </Avatar>
              )}
            </Box>
          </Tooltip>
        </Box>
      </AppBar>
    )
  );
};

export default NavBar;
