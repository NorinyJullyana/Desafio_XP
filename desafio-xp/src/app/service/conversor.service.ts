import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversorService {

  private apiUrl = 'https://api.fxratesapi.com/latest';

  constructor(private http: HttpClient) {}

  obterCotacao(base: string, destino: string, valor: number): Observable<any> {
    const url = `${this.apiUrl}?base=${base}&currencies=${destino}&amount=${valor}&resolution=1m&places=6&format=json`;
    return this.http.get<any>(url);
  }
}