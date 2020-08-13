import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';
import UserController from './controllers/UserController';
import LoginController from './controllers/LoginController';
import verifyJWT from './middlewares/verifyJWT';

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const userController = new UserController();
const loginController = new LoginController();

routes.post('/classes', verifyJWT, classesController.create);
routes.get('/classes', verifyJWT, classesController.index);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

routes.post('/register', userController.store);
routes.get('/perfil', verifyJWT, userController.index);
routes.post('/update', verifyJWT, userController.edit);

routes.post('/login', loginController.store);

export default routes;