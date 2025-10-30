import { Component } from '@angular/core';
import { ConversorMoeda } from './conversor-moeda/conversor-moeda.component';

@Component({
  selector: 'app-root',
  imports: [ConversorMoeda],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'desafio-xp';
}
