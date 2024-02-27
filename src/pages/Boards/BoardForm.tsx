import React, { useEffect, useState } from 'react';
import { Button, MenuItem, TextField, useTheme } from '@mui/material';
import { FolderLock, Unlock, Lock } from 'lucide-react';
import { BoardInterface, BoardSchema, VisibilityTypeEnum } from '../../types/GeneralTypes';
import { useAppStore } from '../../stores/AppStore';
import { emptyBoard } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { boardFunctions } from '../../hooks/boardFunctions';
import { slugify } from '../../hooks/GeneralHooks';
interface Props {
  board: BoardInterface | null;
  type: 'edit' | 'create' | 'confirmDelete' | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
const BoardForm = ({ board, type, setOpenDialog }: Props) => {
  const navigate = useNavigate();
  const createBoard = boardFunctions.createBoard();
  const updateBoard = boardFunctions.updateBoard();
  const [user] = useAppStore((state) => [state.user]);

  const [localBoard, setLocalBoard] = useState<BoardInterface>(board ?? { ...emptyBoard, ownerId: user?.id ?? '' });
  const [error, setError] = useState<{ path: string; message: string }>({ path: '', message: '' });
  const theme = useTheme();
  const handleCreateNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validatedBoard = BoardSchema.safeParse(localBoard);
    if (!validatedBoard.success) {
      return setError({
        path: validatedBoard.error.errors[0].path[0].toString(),
        message: validatedBoard.error.errors[0].message,
      });
    }
    createBoard({ ...validatedBoard.data, slug: slugify(validatedBoard.data.title) });
    setOpenDialog(false);
  };
  const handleUpdateBoard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validatedBoard = BoardSchema.safeParse(localBoard);
    if (!validatedBoard.success) {
      return setError({
        path: validatedBoard.error.errors[0].path[0].toString(),
        message: validatedBoard.error.errors[0].message,
      });
    }
    updateBoard(validatedBoard.data);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!user) navigate(-1);
  }, [user]);
  return (
    <form
      className="boards-form-modal"
      onReset={() => setLocalBoard(emptyBoard)}
      onSubmit={(e) => {
        type === 'create' ? handleCreateNew(e) : handleUpdateBoard(e);
      }}
    >
      <h2
        className="text-overflow"
        style={{
          backgroundColor: theme.palette.mode === 'dark' ? 'var(--white01)' : 'var(--black01)',
          padding: '20px',
        }}
      >
        {type === 'create' ? 'Create New Board' : `Edit Board - ${localBoard.title}`}
      </h2>
      <div className="form">
        <TextField
          name="title"
          label="Title"
          value={localBoard.title}
          onChange={(e) => setLocalBoard((prev) => ({ ...prev, title: e.target.value }))}
          variant="standard"
          error={error.path === 'title'}
          helperText={error.path === 'title' ? error.message : ''}
          onFocus={(e) => {
            e.target.select();
            setError({ path: '', message: '' });
          }}
        />
        <TextField
          select
          label="Visibility"
          value={localBoard.visibilityType}
          variant="standard"
          onChange={(e) =>
            setLocalBoard((prev) => ({
              ...prev,
              visibilityType: e.target.value as VisibilityTypeEnum,
            }))
          }
        >
          <MenuItem value="private">
            <Lock size={15} style={{ marginRight: '10px' }} />
            Private
          </MenuItem>
          <MenuItem value="public">
            <Unlock size={15} style={{ marginRight: '10px' }} />
            Public
          </MenuItem>
          <MenuItem value="onlyMe">
            <FolderLock size={15} style={{ marginRight: '10px' }} />
            Only me
          </MenuItem>
        </TextField>
        <TextField
          name="description"
          label="Description"
          variant="standard"
          value={localBoard.description}
          onChange={(e) => setLocalBoard((prev) => ({ ...prev, description: e.target.value }))}
          error={error.path === 'description'}
          helperText={error.path === 'description' ? error.message : ''}
          onFocus={(e) => {
            e.target.select();
            setError({ path: '', message: '' });
          }}
        />
      </div>
      <div className="buttons">
        <Button type="reset" variant="outlined">
          Reset
        </Button>
        <Button type="submit" variant="contained">
          {type === 'create' ? 'Create New Board' : 'Finish Editing'}
        </Button>
      </div>
    </form>
  );
};

export default BoardForm;
