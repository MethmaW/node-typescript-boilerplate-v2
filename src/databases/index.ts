import config from 'config';
import { dbConfig } from '@interfaces/db.interface';
import validateEnv from '@/utils/validateEnv';

const env = validateEnv()

const dbusername: string = env.ATLAS_USER
const dbuserpassword: string = env.ATLAS_PASSWORD
const dbcluster: string = env.ATLAS_CLUSTER
const dbname: string = env.ATLAS_NAME


const localurl: string = `mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_DATABASE}`
const atlasurl: string = `mongodb+srv://${dbusername}:${dbuserpassword}@${dbcluster}.mongodb.net/${dbname}`

const dbenv: string = env.NODE_ENV;

export const dbConnection = {
  url: atlasurl,
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
