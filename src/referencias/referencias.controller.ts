import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ESTUDIANTES_SERVICE } from 'src/config/service';
import { map } from 'rxjs';

@Controller()
export class ReferenciasController {
  constructor(
    @Inject(ESTUDIANTES_SERVICE)
    private readonly estudianteClient: ClientProxy,
  ) {}

  @Get('sexos')
  getAllSexos() {
    return this.estudianteClient.send({ cmd: 'get_all_sexo' }, {}).pipe(
      map((res: any) => ({
        data: (res.data ?? []).map((s: any) => ({ id: s.id, nombre: s.descripcion })),
      })),
    );
  }

  @Get('etnias')
  getAllEtnias() {
    return this.estudianteClient.send({ cmd: 'get_all_etnia' }, {}).pipe(
      map((res: any) => ({
        data: (res.data ?? []).map((e: any) => ({ id: e.id, nombre: e.descripcion })),
      })),
    );
  }
}
