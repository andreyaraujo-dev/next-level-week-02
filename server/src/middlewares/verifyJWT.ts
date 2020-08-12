import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const verifyJWT = (request: Request, response: Response, next: NextFunction) => {
  const { authorization } = request.headers;
  if (!authorization) return response.status(401).json({ auth: false, message: 'No token provided.' });

  // const token = req.headers['Authorization'];
  // if (!token) return response.status(401).json({ auth: false, message: 'No token provided.' });

  const [, token] = authorization.split(' ');

  try {
    jwt.verify(token, 'KEYSECRET', function(err, decoded) {
      if (err) return response.status(500).json({ auth: false, message: 'Failed to authenticate token' });
  
      //se estiver ok, salva no request para uso posterior
      // request.userId = decoded.id;
      response.setHeader('userId', decoded.id);
      next();
    });
  } catch (error) {
    return response.status(401).json({ message: `Erro: ${error}` });
  }
}

export default verifyJWT;