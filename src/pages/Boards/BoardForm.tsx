import React, { useEffect, useState } from 'react';
import { Button, MenuItem, TextField, useTheme } from '@mui/material';
import { FolderLock, Unlock, Lock } from 'lucide-react';
import { BoardInterface, BoardSchema, GUEST_ID, VisibilityTypeEnum } from '../../types/GeneralTypes';
import { useAppStore } from '../../stores/AppStore';
import { emptyBoard } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { randomId, slugify } from '../../hooks/GeneralHooks';
import { API_createBoard, API_updateBoard } from '../../hooks/API_functions';
import { useBoardsStore } from '../../stores/BoardsStore';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
interface Props {
  board: BoardInterface | null;
  type: 'edit' | 'create' | 'confirmDelete' | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}
const BoardForm = ({ board, type, setOpenDialog }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user] = useAppStore((state) => [state.user]);
  const [localBoard, setLocalBoard] = useState<BoardInterface>(board ?? { ...emptyBoard, ownerId: user?._id ?? '' });
  const [error, setError] = useState<{ path: string; message: string }>({ path: '', message: '' });
  const [addBoard, editBoard] = useBoardsStore((state) => [state.addBoard, state.editBoard]);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: BoardInterface) => API_createBoard(data),
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toast.error('Create board failed!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BoardInterface) => API_updateBoard(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
    onError: () => {
      toast.error('Create board failed!');
    },
  });

  const handleValidate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newId = randomId();
    const validatedBoard = BoardSchema.safeParse(localBoard);
    if (!validatedBoard.success) {
      return setError({
        path: validatedBoard.error.errors[0].path[0].toString(),
        message: validatedBoard.error.errors[0].message,
      });
    }
    // user is guest -> no need to call API, just update the store
    if (user.firstName !== GUEST_ID) {
      type === 'create' &&
        createMutation.mutate({ ...validatedBoard.data, slug: slugify(validatedBoard.data.title), createdAt: new Date().toISOString() });
      type === 'edit' &&
        updateMutation.mutate({ ...validatedBoard.data, slug: slugify(validatedBoard.data.title), updatedAt: new Date().toISOString() });
    } else {
      type === 'create' && addBoard({ ...validatedBoard.data, slug: slugify(validatedBoard.data.title), id: newId });
      type === 'edit' && editBoard({ ...validatedBoard.data, slug: slugify(validatedBoard.data.title) });
    }
    setOpenDialog(false);
  };

  useEffect(() => {
    if (!user) navigate(-1);
    if (user._id) setLocalBoard((prev) => ({ ...prev, ownerId: user._id as string }));
  }, [user]);
  return (
    <form
      className="boards-form-modal"
      onReset={() => setLocalBoard(emptyBoard)}
      onSubmit={(e) => {
        handleValidate(e);
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
