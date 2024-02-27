import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserInterface } from '../types/GeneralTypes';
import { GuestAccount } from '../utils/constants';

interface AppState {
  appBarHeight: number;
  boardBarHeight: number;
  user: UserInterface;
}
interface AppSetState {
  setAppBarHeight: (height: number) => void;
  setBoardBarHeight: (height: number) => void;
  setUser: (user: UserInterface) => void;
}

export const useAppStore = create<AppState & AppSetState>()(
  devtools(
    persist(
      (set) => ({
        appBarHeight: 0,
        setAppBarHeight: (height) => set(() => ({ appBarHeight: height })),
        // --------------------------------------------------------------------
        boardBarHeight: 0,
        setBoardBarHeight: (height) => set(() => ({ boardBarHeight: height })),
        // --------------------------------------------------------------------
        user: GuestAccount,
        setUser: (userData) => set(() => ({ user: userData })),
      }),
      { name: 'DonoVista App Store' },
    ),
  ),
);
