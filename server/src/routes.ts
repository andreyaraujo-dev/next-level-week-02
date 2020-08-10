import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController'
import UserController from './controllers/UserController'

const routes = express.Router();
const classesController = new ClassesController();
const connectionsController = new ConnectionsController();
const userController = new UserController();

routes.post('/classes', classesController.create);
routes.get('/classes', classesController.index);

routes.post('/connections', connectionsController.create);
routes.get('/connections', connectionsController.index);

routes.post('/register', userController.store);
routes.get('/perfil', userController.index);
routes.post('/update', userController.edit);

export default routes;