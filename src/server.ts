import 'dotenv/config';
import App from '@/app';
import validateEnv from '@utils/validateEnv';

import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';


validateEnv();

const app = new App([
    new AuthRoute(),
    new IndexRoute(),
    new UsersRoute(),
]);


app.listen();
