import { Module } from '@nestjs/common';
import { EstudiantesController } from './estudiantes.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ESTUDIANTES_SERVICE } from 'src/config/service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ESTUDIANTES_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.ESTUDIANTES_SERVICES_HOST,
          port: Number(process.env.ESTUDIANTES_SERVICES_PORT),
        },
      },
    ]),
  ],
  controllers: [EstudiantesController],
  providers: [],
})
export class EstudiantesModule {}
