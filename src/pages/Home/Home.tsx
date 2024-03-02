import React, { useEffect, useState } from 'react';
import { Box, Button, Grow, TextField, useTheme } from '@mui/material';
import './Home.scss';
import BrightModeToggle from '../../components/BrightModeToggle';
import { Club, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/AppStore';
import { GUEST_ID } from '../../types/GeneralTypes';
import { z } from 'zod';
import { useBoardsStore } from '../../stores/BoardsStore';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Readme from './Readme';
export default function Home() {
  const theme = useTheme();
  const [state, setState] = useState<'instroduction' | 'features'>('instroduction');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [user] = useAppStore((state) => [state.user]);
  const [invalidEmail, setInvalidEmail] = useState<string | null>(null);
  const [boardList] = useBoardsStore((state) => [state.boardList]);

  const validateEmail = () => {
    const validator = z.string().email({ message: 'Invalid email' });
    const validatedEmail = validator.safeParse(email);
    if (!validatedEmail.success) return setInvalidEmail(validatedEmail.error.errors[0].message);
    return navigate('/sign-up', { state: { email: email } });
  };
  useEffect(() => {
    toast(<Readme />);
  }, []);
  return (
    <div className="Home">
      <div className="bright-mode" style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.7 }}>
        <Button onClick={() => navigate('/sign-in')}>
          {user.firstName === GUEST_ID ? 'Sign In' : `Welcome Back, ${user.firstName} ${user.lastName}`}
        </Button>
        <BrightModeToggle />
      </div>

      <div className="icons">
        <Box
          sx={{
            ':hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black01)',
            },
          }}
          className={state === 'instroduction' ? 'icon active' : 'icon'}
          onClick={() => setState('instroduction')}
        >
          <HomeIcon />
        </Box>
        <Box
          sx={{
            ':hover': {
              bgcolor: theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black01)',
            },
          }}
          className={state === 'features' ? 'icon active' : 'icon'}
          onClick={() => setState('features')}
        >
          <Club />
        </Box>
      </div>
      <Grow in={state === 'instroduction'} mountOnEnter unmountOnExit>
        <div className="hero-section">
          <div className="introduction">
            <p>WEBSITE AND TOOLS FOR PROJECT MANAGEMENT</p>
            <h1>Ensure timely and budget-friendly project completion.</h1>
            <p>Explore DonoVista now</p>
            {user.firstName === GUEST_ID && (
              <TextField
                error={invalidEmail ? true : false}
                helperText={invalidEmail}
                required
                type="email"
                placeholder=" Type your Email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {user.firstName === GUEST_ID && (
              <Button variant="contained" color="primary" disabled={email.length === 0 ? true : false} onClick={validateEmail}>
                Sign Up with us
              </Button>
            )}
            {user.firstName === GUEST_ID && boardList.length === 0 ? (
              <Button
                variant="outlined"
                onClick={() => {
                  navigate('/boards');
                }}
              >
                Continue as GUEST !
              </Button>
            ) : (
              <Button onClick={() => navigate('/boards')}>Visit Your Workspaces</Button>
            )}
          </div>
          <div className="hero-img"></div>
        </div>
      </Grow>
      <Grow in={state === 'features'} mountOnEnter unmountOnExit>
        <div className="features-container">
          <p className="intro">A rapid and adaptable method for organizing your team’s schedule</p>
          <div className="features">
            <div className="feature">
              <div className="feature-img feature-img1"></div>
              <h2>Maintain project progress without needing overtime</h2>
              <p>
                Avoid the primary reason for project delays - excessive resource allocation. Manage workloads effectively with our exclusive waiting
                list feature.
              </p>
            </div>
            <div className="feature">
              <div className="feature-img feature-img2"></div>
              <h2>Enhance and streamline the process of team planning</h2>
              <p>
                Just drag, drop, schedule, or shift. Experience resource planning at its best for dynamic teams that need to keep pace as they grow.
              </p>
            </div>
            <div className="feature">
              <div className="feature-img feature-img3"></div>
              <h2>Stay informed about team availability every day</h2>
              <p>
                Prevent unexpected absences due to vacations. Enable your team to enjoy their time off without compromising on meeting project
                timelines.
              </p>
            </div>
          </div>
        </div>
      </Grow>
    </div>
  );
}
