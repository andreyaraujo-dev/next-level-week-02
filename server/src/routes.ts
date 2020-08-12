import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController'
import UserController from './controllers/UserController'
import LoginController from './controllers/LoginController'

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const userController = new UserController();
const loginController = new LoginController();

routes.post('/classes', classesController.create);
routes.get('/classes', classesController.index);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

routes.post('/register', userController.store);
routes.get('/perfil', userController.index);
routes.post('/update', userController.edit);

routes.post('/login', loginController.store);

export default routes;