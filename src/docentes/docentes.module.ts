import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DOCENTES_SERVICE } from 'src/config/service';
import { DocentesController } from './docentes.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: DOCENTES_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.DOCENTES_SERVICES_HOST,
          port: Number(process.env.DOCENTES_SERVICES_PORT),
        },
      },
    ]),
  ],
  controllers: [DocentesController],
  providers: [],
})
export class DocentesModule {}
