import { useMarkdownStore } from '../stores/MarkdownStore';

const demoFunction = () => {
  const [state] = useMarkdownStore((state) => [state]);
};

export const markdownFunctions = {};
