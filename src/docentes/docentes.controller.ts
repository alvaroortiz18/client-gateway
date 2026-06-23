import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DOCENTES_SERVICE } from 'src/config/service';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';

@Controller('docentes')
export class DocentesController {
  constructor(
    @Inject(DOCENTES_SERVICE)
    private readonly docenteClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createDto: CreateDocenteDto) {
    return this.docenteClient.send({ cmd: 'create_docente' }, createDto);
  }

  @Get()
  getAll() {
    return this.docenteClient.send({ cmd: 'get_all_docentes' }, {});
  }

  @Get('cargos')
  getAllCargos() {
    return this.docenteClient.send({ cmd: 'get_all_cargos' }, {});
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.docenteClient.send({ cmd: 'get_one_docente' }, id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateDocenteDto,
  ) {
    return this.docenteClient.send({ cmd: 'update_docente' }, { id, ...updateDto });
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.docenteClient.send({ cmd: 'remove_docente' }, id);
  }
}
