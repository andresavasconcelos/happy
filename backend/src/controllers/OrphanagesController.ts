import {Request, Response} from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanagesView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {

    async index(request: Request, response: Response) {
        const orphanagesRepository = getRepository(Orphanage);

        const orphanages = await orphanagesRepository.find({
            relations: ['images']
        });

        return response.json(orphanagesView.renderMany(orphanages)); 
    }, 

    async show(request: Request, response: Response) {
        const {id} = request.params;

        const orphanagesRepository = getRepository(Orphanage);

        const orphanage = await orphanagesRepository.findOneOrFail(id, {
            relations: ['images']
        });

        return response.json(orphanagesView.render(orphanage)); 
    }, 

    async create(request: Request, response: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends,
          } = request.body;
     
        const orphanagesRepository = getRepository(Orphanage);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return {path: image.filename}
        });

        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends == 'true',
            images,
        };

        const schema = Yup.object().shape({
            name: Yup.string().required("Nome obrigatório"),
            latitude: Yup.number().required("Latitude obrigatoria"),
            longitude: Yup.number().required("Longitude obrigatoria"),
            about: Yup.string().required("Digite sobre o lugar").max(300),       
            instructions:Yup.string().required("Fale sobre as intruções"),
            opening_hours: Yup.string().required("Fale sobre o horario"),
            open_on_weekends: Yup.boolean().required("Fale sobre se abre de fim de semana"),
            images: Yup.array(
                Yup.object().shape({
                path: Yup.string().required()
            })),
        })

        await schema.validate(data, {
            abortEarly: false,
        });
    
        const orphanage = orphanagesRepository.create(data);
    
        await orphanagesRepository.save(orphanage);
    
        return response.status(201).json({orphanage});
    }
}