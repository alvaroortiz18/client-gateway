import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

@Controller('files')
export class FilesController {
  private readonly filesServiceUrl: string;
  private readonly tmpDir = join(process.cwd(), 'tmp');

  constructor(private readonly configService: ConfigService) {
    this.filesServiceUrl = this.configService.get<string>('FILES_SERVICE_URL') ?? 'http://localhost:3006';
  }

  @Get()
  async findAll(@Query('modelId') modelId?: string) {
    const url = modelId
      ? `${this.filesServiceUrl}/files?modelId=${modelId}`
      : `${this.filesServiceUrl}/files`;
    const response = await axios.get(url);
    return response.data;
  }

  @Post('upload/:modelId')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('modelId', ParseIntPipe) modelId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', 400);
    }

    const tmpPath = join(this.tmpDir, `${randomBytes(8).toString('hex')}-${file.originalname}`);
    await writeFile(tmpPath, file.buffer);

    try {
      const form = new FormData();
      form.append('file', createReadStream(tmpPath), {
        filename: file.originalname,
        contentType: file.mimetype,
      });

      const response = await axios.post(
        `${this.filesServiceUrl}/files/upload/${modelId}`,
        form,
        { headers: form.getHeaders() },
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('File service unavailable', 502);
    } finally {
      await unlink(tmpPath).catch(() => {});
    }
  }

  @Get(':id')
  async serve(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const metadataResponse = await axios.get(
        `${this.filesServiceUrl}/files/${id}/metadata`,
      );
      const metadata = metadataResponse.data;

      const fileResponse = await axios.get(
        `${this.filesServiceUrl}/files/${id}`,
        { responseType: 'stream' },
      );

      res.setHeader('Content-Type', metadata.mime);
      res.setHeader('Content-Disposition', `inline; filename="${metadata.fileName}"`);
      fileResponse.data.pipe(res);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(502).json({ message: 'File service unavailable' });
      }
    }
  }

  @Get(':id/metadata')
  async getMetadata(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await axios.get(
        `${this.filesServiceUrl}/files/${id}/metadata`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('File service unavailable', 502);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const response = await axios.delete(
        `${this.filesServiceUrl}/files/${id}`,
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }
      throw new HttpException('File service unavailable', 502);
    }
  }
}
