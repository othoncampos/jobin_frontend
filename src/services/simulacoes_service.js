import { formatMoney } from '@/services/formatString';

export const valor_emprestimo = (taxa_juros, nr_parcela, valor_parcela) => {
    let tx = taxa_juros / 100;
    let valor = ( (1 - (1+tx)**(nr_parcela*-1))/tx) * valor_parcela;
    return formatMoney(valor);
}
