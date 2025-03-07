import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
    constructor(private readonly prisma: PrismaService) {

    }
    async createStore(data) {
        console.log(data)
        let { user_id, body } = data
        let newStore = await this.prisma.store.create({
            data: {
                ...body,
                user_id: user_id,
                // store_status: false,
                // store_create: new Date
            }
        })
        return newStore
    }
}
