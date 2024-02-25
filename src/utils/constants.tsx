import { z } from 'zod';
import { BoardInterface, VisibilityTypeEnum, UserInterface } from '../types/GeneralTypes';
import { v4 as uuid } from 'uuid';
import { randomId, slugify } from '../hooks/GeneralHooks';

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
  createdAt: '',
  updatedAt: null,
  _destroy: false,
};
export const emptySignUpForm: UserInterface = {
  _id: '',
  id: '',
  firstName: GUEST_ID,
  lastName: '',
  email: '',
  password: '',
  createdAt: '',
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
