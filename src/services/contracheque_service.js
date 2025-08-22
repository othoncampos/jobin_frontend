import Api from "./Api";

// Retorna um resumo dos ultimos contracheques
export const contracheque_resumo = async (emp_id, periodo) => {
    let params = {
      emp_id, 
      periodo, 
      casas_decimais: 2
    }
    try {
        const resp = await Api.get(`/cch/resumo`, params );
        return resp;
    } catch (error) {
        console.error('Erro ao obter resumo:', error.response?.data || error);
    }
}

// Retorna um resumo dos ultimos contracheques
export const contracheque_list_by_emp = async (emp_id) => {
    let params = { emp_id }
    try {
        const resp = await Api.get(`/cch/list_by_emp/${emp_id}`, null );
        return resp;
    } catch (error) {
        console.error('Erro ao obter resumo:', error.response?.data || error);
    }
}

// Retorna um resumo dos ultimos contracheques
export const contracheque_qtd_valor_by_emp = async (emp_id) => {
    try {
        const resp = await Api.get(`/cch/qtd_valor_by_emp/${emp_id}`, null );
        return resp;
    } catch (error) {
        console.error('Erro ao obter resumo:', error.response?.data || error);
    }
}

// Retorna um ano, mes e valor da ultima folha 
export const contracheque_last_cch_by_emp = async (emp_id) => {
    try {
        const resp = await Api.get(`/cch/last_cch_by_emp/${emp_id}`, null );
        return resp;
    } catch (error) {
        console.error('Erro ao obter resumo:', error.response?.data || error);
    }
}