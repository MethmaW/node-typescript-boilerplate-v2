import config from 'config';
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import userModel from '@models/users.model';
import fs from 'fs';
import path from 'path';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {

  try {
    const PUBLIC_KEY = fs.readFileSync(
      path.resolve(__dirname, '../credentials/rs256.key.pub'),
      'utf8'
    )

    const Authorization = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;

    if (Authorization) {
      const verificationResponse = (await jwt.verify(Authorization, PUBLIC_KEY)) as DataStoredInToken;
      
      const userId = verificationResponse._id;
      const findUser = await userModel.findById(userId);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
