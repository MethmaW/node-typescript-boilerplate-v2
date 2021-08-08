import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '@/dtos/auth.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, sedUserData } = await this.authService.signup(userData);

      res.setHeader('Set-Cookie', [cookie.access, cookie.refresh]);
      res.status(201).json({ data: sedUserData, message: 'signup' });

    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: LoginUserDto = req.body;
      const { cookie, sedUserData } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie.access, cookie.refresh]);
      res.status(200).json({ data: sedUserData, message: 'login' });
      
    } catch (error) {
      next(error);
    }
  };

  public refreshAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const REFRESH_TOKEN: string = req.cookies['REFRESH_TOKEN']
      const { cookie, sedUserData } = await this.authService.refreshAuth(REFRESH_TOKEN);

      res.setHeader('Set-Cookie', [cookie.access, cookie.refresh]);
      res.status(200).json({ data: sedUserData, message: 'refreshAuth' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {      
      const userData: User = req.user;
      const logOutUserData = await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0', 'REFRESH_TOKEN=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
