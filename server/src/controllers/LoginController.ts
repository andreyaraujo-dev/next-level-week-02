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

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) return response.status(401).json({error: 'Password is invalid'});

      const token = jwt.sign({id: user.id}, 'KEYSECRET', {
        expiresIn: '1d'
      });

      delete user.password;
      delete user.whatsapp;
      delete user.bio;
      delete user.name;
      delete user.avatar;
      return response.status(200).json({user, token});
    } catch (error) {
      return response.status(400).json({message: 'Unable to login, try again', error: error});
    }
  }
}