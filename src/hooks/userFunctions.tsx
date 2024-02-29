/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation } from '@tanstack/react-query';
import { useAppStore } from '../stores/AppStore';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserInterface } from '../types/GeneralTypes';

// const demoFunction = () => {
//   const [state] = useAppStore((state) => [state]);
// };

type userAuthProps = {
  setError?: React.Dispatch<
    React.SetStateAction<{
      path: string;
      message: string;
    }>
  >;
};

const userSignIn = ({ setError }: userAuthProps) => {
  const [state] = useAppStore((state) => [state]);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/sign-in`, data);
      return response.data;
    },
    onSuccess: (result) => {
      console.log(result);
      if (result.data.code === 300) {
        setError && setError({ path: result.data.path, message: result.data.message });
      }
      if (result.data.code === 200) {
        state.setUser(result.data.data);
        navigate('/boards');
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

const userSignUp = ({ setError }: userAuthProps) => {
  const [state] = useAppStore((state) => [state]);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (data: UserInterface) => {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/sign-up`, data);
      return response.data;
    },
    onSuccess: (result) => {
      console.log(result);
      if (result.data.code === 300) {
        setError && setError({ path: result.data.path, message: result.data.message });
      }
      if (result.data.code === 200) {
        state.setUser(result.data.data);
        navigate('/boards');
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
};

export const userFunctions = {
  userSignIn,
  userSignUp,
};
