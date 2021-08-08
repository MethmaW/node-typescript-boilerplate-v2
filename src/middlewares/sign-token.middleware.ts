import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { DataStoredInToken, TokenData } from '@/interfaces/auth.interface';
import validateEnv from '@utils/validateEnv';

const env = validateEnv();

const PRIVATE_KEY = fs.readFileSync(
	path.resolve(__dirname, '../credentials/rs256.key'),
	'utf8'
)

export const signToken = (payload): TokenData => {
	const dataStoredInToken: DataStoredInToken = { _id: payload._id };
	const refreshSecret: string = env.AUTH_REFRESH_SECRET;
	const accessExpiresIn: number = env.AUTH_ACCESS_EXPIRE;
	const refreshExpiresIn: number = env.AUTH_REFRESH_EXPIRE;

	const accessToken = jwt.sign(dataStoredInToken, PRIVATE_KEY, { expiresIn: accessExpiresIn, algorithm: 'RS256' })
	const refreshToken = jwt.sign(dataStoredInToken, refreshSecret, { expiresIn: refreshExpiresIn });

	return { accessToken, refreshToken};
}

