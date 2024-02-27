import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MarkdownInterface } from '../types/GeneralTypes';
import { emptyMarkdown } from '../utils/constants';

interface MarkdownState {
  markdownList: MarkdownInterface[];
  activeMarkdown: MarkdownInterface;
}
interface MarkdownSetState {
  setMarkdownList: (newMarkdownList: MarkdownInterface[]) => void;
  addToMarkdownList: (markDown: MarkdownInterface) => void;
  removeFromMarkdownList: (markdown: MarkdownInterface) => void;
  editFromMarkdownList: (markdown: MarkdownInterface) => void;
  setActiveMarkdown: (markdown: MarkdownInterface) => void;
}

export const useMarkdownStore = create<MarkdownState & MarkdownSetState>()(
  devtools(
    persist(
      (set) => ({
        markdownList: [],
        setMarkdownList: (newMarkdownList: MarkdownInterface[]) => set(() => ({ markdownList: newMarkdownList })),
        addToMarkdownList: (markDown: MarkdownInterface) =>
          set((state) => ({
            markdownList: [...state.markdownList, markDown],
          })),
        removeFromMarkdownList: (markdown: MarkdownInterface) =>
          set((state) => ({ markdownList: state.markdownList.filter((md) => md.id !== markdown.id) })),
        editFromMarkdownList: (markdown: MarkdownInterface) =>
          set((state) => {
            console.log(state.markdownList.map((md) => (md.id === markdown.id ? markdown : md)));
            return {
              markdownList: state.markdownList.map((md) => (md.id === markdown.id ? markdown : md)),
            };
          }),
        activeMarkdown: emptyMarkdown,
        setActiveMarkdown: (markdown: MarkdownInterface) => set(() => ({ activeMarkdown: markdown })),
      }),
      { name: 'DonoVista Markdown Store' },
    ),
  ),
);
