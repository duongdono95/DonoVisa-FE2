import { useMarkdownStore } from '../stores/MarkdownStore';

const useDemoFunction = () => {
  const [state] = useMarkdownStore((state) => [state]);
};

export const markdownFunctions = {};
