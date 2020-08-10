import { Request, Response } from 'express';
import db from '../database/connection';
import bcrypt from 'bcryptjs';

import convertHoursToMinutes from "../utils/convertHoursToMinutes";

interface ScheduleItem {
  week_day: number;
  from: string;
  to: string;
}

export default class UserController {
  async index(request: Request, response: Response) {
    const id = request.headers.userid;

    try {
      const user = await db('users').where('id', id).select('*');

      if (!user) return response.status(400).json({
        error: 'User does not exists'
      });

      return response.status(201).json(user);
    } catch (error) {
      return response.status(400).json({
        error: 'Não foi possível carregar o perfil, tente novamente'
      });
    }
  }

  async store(request: Request, response: Response) {
    const { name, email, password } = request.body;

    try {
      const passwordHash = await bcrypt.hash(password, 8);
  
      await db('users').insert({
        name,
        email,
        password: passwordHash
      });
  
      return response.status(201).send();

    } catch (error) {
      return response.status(400).json({
        error: 'Não foi possivel realizar o cadastro'
      });
    }
  }

  async edit(request: Request, response: Response) {
    const { 
      name, 
      email, 
      whatsapp, 
      avatar,
      bio, 
      subject, 
      cost, 
      schedule 
    } = request.body;

    const userId = request.headers.userid;

    const trx = await db.transaction();

    try {
      await trx('users').where('id', userId).update({
        name,
        email,
        whatsapp,
        avatar,
        bio
      });

      const classUser = await trx('classes').where('user_id', userId).select('*');

      if (classUser.length > 0) {
        const updatedClassesId = await trx('classes').where({'user_id': userId}).update({
          subject,
          cost,
        }, ['id']);
        const class_id = updatedClassesId[0];
        
        await trx('class_schedule').where('class_id', class_id).del();
  
        const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
          return {
            class_id,
            week_day: scheduleItem.week_day,
            from: convertHoursToMinutes(scheduleItem.from),
            to: convertHoursToMinutes(scheduleItem.to),
          };
        });
      
        await trx('class_schedule').insert(classSchedule);
      } 

      await trx.commit();

      return response.status(201).send();
    } catch (error) {
      await trx.rollback();

      return response.status(400).json({
        error: 'Erro ao atualizar seus dados, tente novamente',
      });
    }
  }
}