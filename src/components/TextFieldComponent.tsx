/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton, TextField } from '@mui/material';
import { Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../hooks/GeneralHooks';

interface Props {
  data: any;
  handleResult: (localData: any) => void;
  fontSize?: number;
}
const TextFieldComponent = ({ data, handleResult, fontSize }: Props) => {
  const textFieldRef = useRef<HTMLDivElement>(null);
  const [readOnly, setReadOnly] = useState(true);
  const [localData, setLocalData] = useState(data);
  const submit = () => {
    handleResult(localData);
    setReadOnly(true);
  };
  useOutsideClick(textFieldRef, () => {
    if (!readOnly) setReadOnly(true);
    setLocalData((prev: any) => ({ ...prev, title: data.title }));
  });
  useEffect(() => {
    setLocalData(data);
  }, [data]);
  return (
    <Box
      ref={textFieldRef}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexGrow: 1,
      }}
    >
      <TextField
        inputProps={{
          style: {
            color: 'var(--black07)',
            fontSize: fontSize ?? 14,
            cursor: 'pointer',
            fontWeight: 600,
          },
        }}
        InputProps={{
          disableUnderline: readOnly,
          readOnly: readOnly,
        }}
        fullWidth
        variant={'standard'}
        value={localData.title.charAt(0).toUpperCase() + localData.title.slice(1)}
        size={'small'}
        onChange={(e) =>
          setLocalData((prev: any) => {
            return { ...prev, title: e.target.value };
          })
        }
        onDoubleClick={(e) => {
          e.stopPropagation();
          setReadOnly(false);
        }}
        onKeyDown={(e) => {
          e.key === 'Enter' && submit();
          e.key === 'Escape' && setReadOnly(true);
        }}
      />
      {!readOnly && (
        <IconButton onClick={() => submit()}>
          <Send size={20} />
        </IconButton>
      )}
    </Box>
  );
};

export default TextFieldComponent;
