import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import db from '../database/connection';
import bcrypt from 'bcryptjs';

export default class LoginController {
  async store(request: Request, response: Response) {
    const { email, password } = request.body;

    try {
      const [user] = await db('users').select('*').where('email', email);
      if (!user) return response.status(400).json({error: 'User does not exists'});

      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) return response.status(400).json({error: err});
        if (!isValid) return response.status(400).json({error: 'Password is invalid'});

        const userId = user.id;
        const token = jwt.sign({userId}, 'KEYSECRET', {
          expiresIn: 300
        });

        return response.status(200).json({userId, auth: true, token: token});
      });
    } catch (error) {
      return response.status(400).json({message: 'Unable to login, try again', error: error});
    }
  }
}