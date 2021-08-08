import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  _id: string;
}

export interface TokenData {
  accessToken: string;
  refreshToken: string;
}

export interface TokenPayload {
  _id: string;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface Cookie {
  access: string;
  refresh: string;
}

