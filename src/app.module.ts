import { Module } from '@nestjs/common';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { FilesModule } from './files/files.module';
import { DocentesModule } from './docentes/docentes.module';

@Module({
  imports: [EstudiantesModule, FilesModule, DocentesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
