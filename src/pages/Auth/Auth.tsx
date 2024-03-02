import { useEffect } from 'react';
import './Auth.scss';
import AuthModal from '../../components/AuthModal';
import BrightModeToggle from '../../components/BrightModeToggle';

import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../stores/AppStore';
import { GUEST_ID } from '../../types/GeneralTypes';

const Auth = () => {
  const navigate = useNavigate();
  const [user] = useAppStore((state) => [state.user]);
  useEffect(() => {
    user?.firstName !== GUEST_ID && user?.id && navigate('/boards');
  }, [user]);
  return (
    <div className={'AuthPage'}>
      <div className={'bright-mode'}>
        <BrightModeToggle />
      </div>
      <AuthModal />
    </div>
  );
};

export default Auth;
