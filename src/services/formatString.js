import { format, parseISO } from 'date-fns';

const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
});

export const formatBoolean = (value, valueTrue = 'SIM', valueFalse = 'NÃO') => {
    const normalizedValue = String(value).toLowerCase();
    const isTrue = ['true', '1'].includes(normalizedValue);
    return isTrue ? valueTrue : valueFalse;
};

export const formatText = (text) => {
    const replacedText = text.replace(/_/g, ' ');
    return replacedText.charAt(0).toUpperCase() + replacedText.slice(1);
};

export const formatMoney = (text) => {
    return formatter.format(text);
};

export const data_formatada_YYYY_MM_DD = (date) => {
    let d = new Date(date);
    let ano = d.getFullYear();
    let mes = ("0" + (d.getMonth() + 1)).slice(-2);
    let dia = ("0" + d.getDate()).slice(-2);
    return ano + '-' + mes + '-' + dia;
};

export const data_formatada_DD_MM_YYYY = (date, incluirHora = false) => {
    if (!date) {
        return incluirHora ? '??/??/???? 00:00:00' : '??/??/????';
    }

    const d = new Date(date);
    const pad = (num) => String(num).padStart(2, '0');

    const dia = pad(d.getDate());
    const mes = pad(d.getMonth() + 1);
    const ano = d.getFullYear();

    if (incluirHora) {
        const hora = pad(d.getHours());
        const minuto = pad(d.getMinutes());
        const segundo = pad(d.getSeconds());
        return `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;
    }

    return `${dia}/${mes}/${ano}`;
};


export const formatarData = (dateStr) => {
    return dateStr ? format(parseISO(dateStr), 'dd/MM/yyyy hh:mm:ss') : '';
  }