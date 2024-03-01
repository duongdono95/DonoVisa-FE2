import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { CardInterface, MarkdownInterface } from '../types/GeneralTypes';

interface MarkdownState {
  markdownList: MarkdownInterface[];
  activeCard: CardInterface | null;
}
interface MarkdownSetState {
  setMarkdownList: (newMarkdownList: MarkdownInterface[]) => void;
  addToMarkdownList: (markDown: MarkdownInterface) => void;
  removeFromMarkdownList: (markdown: MarkdownInterface) => void;
  editFromMarkdownList: (markdown: MarkdownInterface) => void;
  setActiveCard: (card: CardInterface | null) => void;
}

export const useMarkdownStore = create<MarkdownState & MarkdownSetState>()(
  devtools(
    persist(
      (set) => ({
        markdownList: [],
        setMarkdownList: (newMarkdownList: MarkdownInterface[]) => set(() => ({ markdownList: newMarkdownList })),
        addToMarkdownList: (markDown: MarkdownInterface) =>
          set((state) => {
            const markdown = state.markdownList.find((md) => md.id === markDown.id);
            if (!markdown) {
              return {
                markdownList: [...state.markdownList, markDown],
              };
            } else {
              return {
                markdownList: state.markdownList.map((md) => (md.id === markDown.id ? markDown : md)),
              };
            }
          }),
        removeFromMarkdownList: (markdown: MarkdownInterface) =>
          set((state) => ({ markdownList: state.markdownList.filter((md) => md.id !== markdown.id) })),
        editFromMarkdownList: (markdown: MarkdownInterface) =>
          set((state) => {
            return {
              markdownList: state.markdownList.map((md) => (md.id === markdown.id ? markdown : md)),
            };
          }),
        activeCard: null,
        setActiveCard: (card: CardInterface | null) => set(() => ({ activeCard: card })),
      }),
      { name: 'DonoVista Markdown Store' },
    ),
  ),
);
