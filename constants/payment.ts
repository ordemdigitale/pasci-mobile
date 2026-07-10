import { PaymentNumbers } from '../services/types';

export const DEFAULT_PAYMENT_NUMBERS: PaymentNumbers = {
  wave_number: '+225 07 09 51 88 75',
  orange_money_number: '+225 07 09 51 88 75',
};

export function buildPaymentOperators(numbers: PaymentNumbers = DEFAULT_PAYMENT_NUMBERS) {
  return [
    {
      value: 'wave' as const,
      label: 'Wave',
      color: '#2563EB',
      bg: '#EFF6FF',
      border: '#BFDBFE',
      phone: numbers.wave_number || DEFAULT_PAYMENT_NUMBERS.wave_number,
    },
    {
      value: 'orange_money' as const,
      label: 'Orange Money',
      color: '#EA580C',
      bg: '#FFF7ED',
      border: '#FED7AA',
      phone: numbers.orange_money_number || DEFAULT_PAYMENT_NUMBERS.orange_money_number,
    },
  ];
}
