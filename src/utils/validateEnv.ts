import { cleanEnv, port, str, num, bool } from 'envalid';

const validateEnv = () => 
  cleanEnv(process.env, {
    LOG_FORMAT: str(),
    LOG_DIR: str(),

    CORS_ORIGIN: str(),
    CORS_CREDENTIALS: bool(),

    PORT: port(),
    NODE_ENV: str(),

    ATLAS_USER: str(),
    ATLAS_PASSWORD: str(),
    ATLAS_CLUSTER: str(),
    ATLAS_NAME: str(),

    DB_HOST: str(),
    DB_PORT: str(),
    DB_DATABASE: str(),

    AUTH_REFRESH_SECRET: str(),
    AUTH_ACCESS_EXPIRE: num(),
    AUTH_REFRESH_EXPIRE: num(),
    
    REDIS_PORT: str(),
    REDIS_HOST: str(),
  });


export default validateEnv;
