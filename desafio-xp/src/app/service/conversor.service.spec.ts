import { TestBed } from '@angular/core/testing';
import { ConversorService } from './conversor.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ConversorService', () => {
  let service: ConversorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConversorService]
    });

    service = TestBed.inject(ConversorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve chamar a API com a URL correta e retornar o Observable', () => {
    const mockResponse = {
      base: 'BRL',
      date: '2025-10-30T04:39:00.000Z',
      rates: { USD: 20 },
      success: true,
      timestamp: 1234567890
    };

    const base = 'BRL';
    const destino = 'USD';
    const valor = 100;

    service.obterCotacao(base, destino, valor).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `https://api.fxratesapi.com/latest?base=${base}&currencies=${destino}&amount=${valor}&resolution=1m&places=6&format=json`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('deve tratar erro da API corretamente', () => {
    const base = 'BRL';
    const destino = 'USD';
    const valor = 100;

    service.obterCotacao(base, destino, valor).subscribe({
      next: () => fail('O Observable deveria falhar e chamar error'),
      error: (err) => {
        expect(err.status).toBe(500);
        expect(err.statusText).toBe('Server Error');
      }
    });

    const req = httpMock.expectOne(
      `https://api.fxratesapi.com/latest?base=${base}&currencies=${destino}&amount=${valor}&resolution=1m&places=6&format=json`
    );

    req.flush('Erro do servidor', { status: 500, statusText: 'Server Error' });
  });
});
