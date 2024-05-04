import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name)
  constructor(private readonly httpService: HttpService) { }

  async cpfValidator(cnpj: string, cpf: string): Promise<Object> {
    const apiUrl = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
    const { data } = await firstValueFrom(
      this.httpService.get<any>(apiUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw `Error on fetch CNPJ: ${cnpj}`
        }),
      ),
    );
    cpf = cpf.replace(/^.{3}(.*)(.{2})$/, "***$1**");

    console.log("CPF:", cpf)
    const isAssociate = data.qsa.some((socio: any) => socio.cpf_representante_legal == cpf || socio.cnpj_cpf_do_socio == cpf)
    return {
      "CPF": cpf,
      "data": data,
      "representante": data.qsa.cpf_representante_legal,
      "cpf": data.qsa.cnpj_cpf_do_socio,
      "associado": isAssociate
    };
  }
} 
