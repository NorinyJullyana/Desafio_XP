import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { ConversorService } from '../service/conversor.service';
import { Moeda, MOEDAS } from '../models/moeda.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-conversor-moeda',
  standalone: true,
  templateUrl: './conversor-moeda.component.html',
  styleUrls: ['./conversor-moeda.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    NgxCurrencyDirective,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDividerModule,
  ]
})
export class ConversorMoeda {

  moedas: Moeda[] = MOEDAS;
  MoedaOrigem: string = this.moedas[0].value;
  MoedaPara: string = this.moedas[1].value;
  ValorMoeda: number = 0;
  resultado: any;
  erroApi: string | null = null;

  constructor(private conversorService: ConversorService) {}

  get prefixo(): string {
    const moeda = this.moedas.find(m => m.value === this.MoedaOrigem);
    return moeda ? moeda.symbol : '';
  }

  capturarDados() {
    this.resultado = null;
    this.erroApi = null;

    if (this.ValorMoeda <= 0) return;
    if (this.MoedaOrigem === this.MoedaPara) return;

    this.converter();
  }

  converter() {
    this.conversorService
      .obterCotacao(this.MoedaOrigem, this.MoedaPara, this.ValorMoeda)
      .pipe(
        catchError((err) => {
          this.resultado = null;
            if (err.status === 429) {
              this.erroApi = `Erro da API ${err.status}: Muitas requisições (Too Many Requests)`;
            }
            else {
              this.erroApi = `Erro ao acessar a API: ${err.status} - Não foi possível obter detalhes`;
            }
          return of(null);
        })
      )
      .subscribe((res) => {
        if (res) {
          this.resultado = res;
          this.erroApi = null;
        }
      });
  }
}
