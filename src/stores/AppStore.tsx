import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { UserInterface } from '../types/GeneralTypes';

interface AppState {
  appBarHeight: number;
  boardBarHeight: number;
  user: UserInterface | null;
}
interface AppSetState {
  setAppBarHeight: (height: number) => void;
  setBoardBarHeight: (height: number) => void;
  setUser: (user: UserInterface | null) => void;
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
        user: null,
        setUser: (userData) => set(() => ({ user: userData })),
      }),
      { name: 'DonoVista App Store' },
    ),
  ),
);
