import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConversorMoeda } from './conversor-moeda.component';
import { ConversorService } from '../service/conversor.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxCurrencyDirective } from 'ngx-currency';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Moeda, MOEDAS } from '../models/moeda.model';

describe('ConversorMoeda', () => {
  let component: ConversorMoeda;
  let fixture: ComponentFixture<ConversorMoeda>;
  let mockService: jasmine.SpyObj<ConversorService>;

  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj('ConversorService', ['obterCotacao']);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        NgxCurrencyDirective,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatButtonModule,
        MatDividerModule
      ],
      declarations: [],
      providers: [
        { provide: ConversorService, useValue: mockService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversorMoeda);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('não deve converter se o valor for <= 0', () => {
    component.ValorMoeda = 0;
    component.MoedaOrigem = 'BRL';
    component.MoedaPara = 'USD';

    component.capturarDados();
    expect(component.resultado).toBeNull();
    expect(mockService.obterCotacao).not.toHaveBeenCalled();
  });

  it('não deve converter se as moedas forem iguais', () => {
    component.ValorMoeda = 100;
    component.MoedaOrigem = 'BRL';
    component.MoedaPara = 'BRL';

    component.capturarDados();
    expect(component.resultado).toBeNull();
    expect(mockService.obterCotacao).not.toHaveBeenCalled();
  });

  it('deve chamar o serviço e armazenar resultado ao converter', () => {
    const fakeResponse = {
      base: 'BRL',
      date: '2025-10-30T04:39:00.000Z',
      rates: { USD: 20 }
    };
    mockService.obterCotacao.and.returnValue(of(fakeResponse));

    component.ValorMoeda = 100;
    component.MoedaOrigem = 'BRL';
    component.MoedaPara = 'USD';

    component.capturarDados();

    expect(mockService.obterCotacao).toHaveBeenCalledWith('BRL', 'USD', 100);
    expect(component.resultado).toEqual(fakeResponse);
  });

  it('deve tratar erro do serviço e manter resultado nulo', () => {
    mockService.obterCotacao.and.returnValue(throwError(() => new Error('Erro')));

    component.ValorMoeda = 100;
    component.MoedaOrigem = 'BRL';
    component.MoedaPara = 'USD';

    component.capturarDados();

    expect(component.resultado).toBeNull();
  });

  it('prefixo deve retornar símbolo correto da moeda de origem', () => {
    component.MoedaOrigem = 'USD';
    expect(component.prefixo).toBe(
      MOEDAS.find(m => m.value === 'USD')!.symbol
    );
  });

  it('deve tratar erro 429 da API corretamente', () => {
  const errorResponse: any = { status: 429 };
  mockService.obterCotacao.and.returnValue(throwError(() => errorResponse));

  component.ValorMoeda = 100;
  component.MoedaOrigem = 'BRL';
  component.MoedaPara = 'USD';

  component.capturarDados();

  expect(component.resultado).toBeNull();
  expect(component.erroApi).toBe('Erro da API 429: Muitas requisições (Too Many Requests)');
  });
});