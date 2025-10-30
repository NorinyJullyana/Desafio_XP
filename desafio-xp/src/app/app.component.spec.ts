import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConversorService } from './service/conversor.service';
import { ConversorMoeda } from './conversor-moeda/conversor-moeda.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ConversorMoeda,
        HttpClientTestingModule
      ],
      providers: [ConversorService]
    }).compileComponents();
  });

  it('deve criar o aplicativo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve ter o título "desafio-xp"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('desafio-xp');
  });

  it('deve renderizar a propriedade título no template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    expect(app.title).toContain('desafio-xp');
  });
});
