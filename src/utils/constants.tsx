import { BoardInterface, VisibilityTypeEnum, UserInterface, MarkdownInterface } from '../types/GeneralTypes';
import { randomId } from '../hooks/GeneralHooks';

export const GUEST_ID = 'guestId';
export const emptyBoard: BoardInterface = {
  _id: '',
  id: randomId(),
  title: '',
  slug: '',
  visibilityType: VisibilityTypeEnum.Private,
  description: '',
  ownerId: GUEST_ID,
  memberIds: [],
  columnOrderIds: [],
  columns: [],
  createdAt: new Date().toISOString(),
  updatedAt: null,
  _destroy: false,
};
export const emptyUserForm: UserInterface = {
  _id: '',
  id: randomId(),
  firstName: GUEST_ID,
  lastName: '',
  email: '',
  password: '',
  createdAt: new Date().toISOString(),
  updatedAt: null,
};

export const GuestAccount: UserInterface = {
  _id: GUEST_ID,
  id: randomId(),
  firstName: GUEST_ID,
  lastName: GUEST_ID,
  email: `${GUEST_ID}@gmail.com`,
  password: GUEST_ID,
  createdAt: new Date().toString(),
  updatedAt: null,
};

export const emptyMarkdown: MarkdownInterface = {
  _id: '',
  id: randomId(),
  cardId: '',
  content: '',
  createdAt: new Date().toString(),
  updatedAt: null,
  _destroy: false,
};
