import React, { useEffect, useState } from 'react';
import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  UndoRedo,
  BoldItalicUnderlineToggles,
  toolbarPlugin,
  InsertImage,
  imagePlugin,
  InsertTable,
  tablePlugin,
  InsertThematicBreak,
  thematicBreakPlugin,
  ListsToggle,
  listsPlugin,
} from '@mdxeditor/editor';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import { MarkdownInterface } from '../types/GeneralTypes';

interface Props {
  localMarkdown: MarkdownInterface;
  setLocalMarkdown: React.Dispatch<React.SetStateAction<MarkdownInterface>>;
}
const Markdown = ({ localMarkdown, setLocalMarkdown }: Props) => {
  const [localMd, setLocalMd] = useState(localMarkdown);
  const handleMarkdownChange = (newMarkdown: string) => {
    setLocalMarkdown({ ...localMarkdown, content: newMarkdown });
    setLocalMd({ ...localMarkdown, content: newMarkdown });
  };
  const convertImageToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const maxFileSize = 5 * 1024 * 1024;
      if (file.size > maxFileSize) {
        reject('File size exceeds the 5MB limit.');
        toast.error('File size exceeds the 5MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  useEffect(() => {
    if (localMarkdown) {
      setLocalMd(localMarkdown);
    }
  }, [localMarkdown]);
  return (
    <MDXEditor
      key={localMarkdown.id}
      markdown={localMarkdown.content}
      onChange={handleMarkdownChange}
      autoFocus
      onBlur={() => {
        setLocalMarkdown(localMd);
      }}
      plugins={[
        imagePlugin({
          imageUploadHandler: async (image: File) => {
            const base64Img = await convertImageToBase64(image);
            return (base64Img as string) ?? '';
          },
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        listsPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', boxShadow: '2px 0px 5px var(--black01)' }}>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <InsertImage />
              <InsertTable />
              <InsertThematicBreak />
              <ListsToggle />
            </Box>
          ),
        }),
      ]}
    />
  );
};

export default Markdown;
