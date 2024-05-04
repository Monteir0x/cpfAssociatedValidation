import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDTO } from './register-payload.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post()
  @HttpCode(200)
  async receivePayload(@Body() payload: RegisterDTO) {
    console.log(payload.cnpj, payload.cpf)
    const consult = await this.appService.cpfValidator(payload.cnpj, payload.cpf);
    return consult

  }
}
