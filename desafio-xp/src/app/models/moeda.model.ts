export interface Moeda {
  value: string;
  viewValue: string;
  symbol: string;
}

export const MOEDAS: Moeda[] = [
  { value: 'BRL', viewValue: 'BRL - Real Brasileiro', symbol: 'R$ ' },
  { value: 'USD', viewValue: 'USD - Dólar Americano', symbol: '$ ' },
  { value: 'EUR', viewValue: 'EUR - Euro', symbol: '€ ' },
  { value: 'GBP', viewValue: 'GBP - Libra Esterlina', symbol: '£ ' },
];