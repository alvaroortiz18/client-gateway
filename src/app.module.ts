import { Module } from '@nestjs/common';
import { EstudiantesModule } from './estudiantes/estudiantes.module';

@Module({
  imports: [EstudiantesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
