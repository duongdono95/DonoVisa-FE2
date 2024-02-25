import React, { useState, useEffect } from 'react';
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

interface Props {
  handleMarkdown: React.Dispatch<React.SetStateAction<string>>;
}
const Markdown = ({ handleMarkdown }: Props) => {
  const [markdown, setMarkdown] = useState('');
  const handleMarkdownChange = (newMarkdown: string) => {
    setMarkdown(newMarkdown);
    handleMarkdown(newMarkdown);
  };
  const convertImageToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const maxFileSize = 50 * 1024 * 1024;
      if (file.size > maxFileSize) {
        reject('File size exceeds the 50MB limit.');
        toast.error('File size exceeds the 50MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <MDXEditor
      // className={'mdx-editor'}
      markdown={markdown}
      onChange={handleMarkdownChange}
      autoFocus
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
