import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginUserDto } from '@/dtos/auth.dto';
import { HttpException } from '@exceptions/HttpException';
import { TokenData, TokenPayload, Cookie } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import { signToken } from "../middlewares/sign-token.middleware"
import redisClient from '@/redis';
import validateEnv from '@/utils/validateEnv';

const env = validateEnv()

class AuthService {
  public users = userModel;
  private signToken = signToken

  public async signup(userData: CreateUserDto): Promise<{ cookie: Cookie; sedUserData: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (findUser) throw new HttpException(409, `You're email ${userData.email} already exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });

    const tokenData = await this.signToken(createUserData._id);
    const cookie = this.createCookie(tokenData);
    const { _id, firstName, lastName, email } = createUserData
    const sedUserData = {
      _id,
      firstName,
      lastName,
      email
    }
    
    const redisUserId = _id.toString()
    const redisUserRefreshToken = tokenData.refreshToken.toString()

    await redisClient.set(redisUserId, redisUserRefreshToken);

    return { cookie, sedUserData };
  }

  public async login(userData: LoginUserDto): Promise<{ cookie: Cookie; sedUserData: User }> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email });
    if (!findUser) throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");
    
    const tokenData = await this.signToken(findUser);
    const cookie = this.createCookie(tokenData);
    const { _id, firstName, lastName, email } = findUser
    const sedUserData = {
      _id,
      firstName,
      lastName,
      email
    }

    const redisUserId = _id.toString()
    const redisUserRefreshToken = tokenData.refreshToken.toString()

    await redisClient.set(redisUserId, redisUserRefreshToken);

    return { cookie, sedUserData };
  }

  public async refreshAuth(refreshAuth): Promise<{ cookie: Cookie; sedUserData: User }> {
    try {
      const { _id: userId } = jwt.verify(refreshAuth, env.AUTH_REFRESH_SECRET) as TokenPayload;
      
      const user = await this.users.findOne({ _id: userId });

      if (!user) {
        throw new HttpException(400, 'Invalid token');
      }

      const token = await redisClient.get(userId);

      if (!token) {
        throw new HttpException(400, 'Invalid token');
      }

    
      const tokenData = await this.signToken(user);
      const cookie = this.createCookie(tokenData);

      const redisUserId = userId.toString()
      const redisUserRefreshToken = tokenData.refreshToken.toString()

      await await redisClient.del(redisUserId);
      await await redisClient.set(redisUserId, redisUserRefreshToken);

   
      const { _id, firstName, lastName, email } = user;
      const sedUserData = {
        _id,
        firstName,
        lastName,
        email
      }

      return { cookie, sedUserData };
    } catch (error) {
      throw new HttpException(400, 'Invalid token');
    }
  }

  public createCookie(tokenData: TokenData): Cookie {
    return { access: `Authorization=${tokenData.accessToken}; HttpOnly;`, refresh: `REFRESH_TOKEN=${tokenData.refreshToken}; HttpOnly;` };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
    if (!findUser) throw new HttpException(409, `Your email ${userData.email} not found`);

    const { _id, firstName, lastName, email } = findUser
    const sedUserData = {
      _id,
      firstName,
      lastName,
      email
    }

    const redisUserId = _id.toString()
    await await redisClient.del(redisUserId);

    return sedUserData;
  }



}

export default AuthService;
