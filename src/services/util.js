export const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];

export const monthName = (monthNumber) => {
    if ( monthNumber == 0 ) {
        const today = new Date();
        monthNumber = today.getMonth();
    }
    return months[monthNumber - 1];
};


export const months_name = [
    { number: 1, name: 'Janeiro' },
    { number: 2, name: 'Fevereiro' },
    { number: 3, name: 'Março' },
    { number: 4, name: 'Abril' },
    { number: 5, name: 'Maio' },
    { number: 6, name: 'Junho' },
    { number: 7, name: 'Julho' },
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' }
];

export const list_months = [
    { number: 1, name: 'Janeiro' },
    { number: 2, name: 'Fevereiro' },
    { number: 3, name: 'Março' },
    { number: 4, name: 'Abril' },
    { number: 5, name: 'Maio' },
    { number: 6, name: 'Junho' },
    { number: 7, name: 'Julho' },
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' }
];

// Convertendo a lista de meses em opções para o select
export const monthOptions = list_months.map(month => ({
    value: month.number,  // Usando o número do mês como valor
    text: month.name      // Usando o nome do mês como texto exibido
}));

export const formatFileSize = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}

export const padTo2Digits = (input) => {
  const num = Number(input);

  if (isNaN(num)) return '00'; // ou jogue um erro

  const sign = num < 0 ? '-' : '';
  const absStr = Math.abs(num).toString().padStart(2, '0');

  return `${sign}${absStr}`;
}


function formatDate(date) {
    let d = new Date(date);
    return [
      d.getFullYear(),
      padTo2Digits(d.getMonth() + 1),
      padTo2Digits(d.getDate()),
    ].join('-');
}