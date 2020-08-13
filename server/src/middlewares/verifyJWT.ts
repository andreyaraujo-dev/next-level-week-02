import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function verifyJWT(request: Request, response: Response, next: NextFunction) {
  const { authorization } = request.headers;
  if (!authorization) return response.status(401).json({ auth: false, message: 'No token provided.' });

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, 'KEYSECRET');

    const { id } = data as TokenPayload;

    request.userId = id;

    return next();
  } catch {
    return response.status(401).json({ message: 'No token provided.' });
  }
}