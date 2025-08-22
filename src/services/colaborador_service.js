import Api from "./Api";

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    let d = new Date(date);
    return [
      d.getFullYear(),
      padTo2Digits(d.getMonth() + 1),
      padTo2Digits(d.getDate()),
    ].join('-');
}

export const colaborador_dados_minimos = async (emp_id, col_id) => {
    try {
        const resp = await Api.get(`/col/dados_minimos/${emp_id}/${col_id}`);
        console.log('resp');
        console.log(resp.esocial);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

// Retornar do backend a quantidade de colaboradores de uma empresa baseado no status
export const colaborador_qtd_status = async (emp_id, status) => {
  try {
      const resp = await Api.get(`/col/col_qtd_status/${emp_id}/${status}`);
      console.log('resp');
      console.log(resp);
      return resp;
  } catch (error) {
      console.error(error);
  }
}

export const colaborador_get_by_emp = async (emp_id) => {
  try {
      const resp = await Api.get(`/col/${emp_id}`);
      // console.log('colaborador_get_by_emp: ', resp);
      return resp;
  } catch (error) {
      console.error(error);
  }
}

export const colaborador_get = async (emp_id, col_id) => {
  try {
      const resp = await Api.get(`/col/${emp_id}/${col_id}`);
      console.log('colaborador_get: ', resp);
      return resp;
  } catch (error) {
      console.error(error);
  }
}

export const colaborador_delete = async (col_id) => {
  console.log(col_id);
  try {
    const resp = await Api.delete(`/col/${col_id}`, null);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const funcionario_create = async (obj) => {
    try {
        console.log('funcionario_create: obj.data_admissao: ', formatDate(obj.data_nascimento));
        
        var data = JSON.stringify(obj, function (key, value) {
          if (key === "data_admissao") {
            console.log('data_admissao', value);
            return formatDate(value);
          } else if (key === "data_nascimento") {
            console.log('data_nascimento', value);
            return formatDate(value);
          } else {
            return value;
          }
        });
  
        console.log('funcionario_create: data.data_admissao: ', data);
        console.log('funcionario_create', data);
        const resp = await Api.post(`funcionarios/`, data);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

export const employee_getListByCompany = async (id_company) => {
  try {
    const resp = await Api.get(`funcionarios/empresa/${id_company}`);
    return resp;
  } catch (error) {
    console.error(error); 
  }
}

export const colaborador_update = async (emp_id, col_id, obj) => {
    try {
        // delete obj.create_at;
        // delete obj.update_at;
        // let data = JSON.stringify(obj);
        console.log('colaborador_update:', emp_id, col_id, obj);
        const resp = await Api.put(`col/${emp_id}/${col_id}`, obj);
        console.log('colaborador_update.resp:', resp);
        return resp;
    } catch (error) {
        console.error(error);
    }
}

// Retorna o ultimo contracheques de um colocaborador
export const colaborador_get_last_cch = async (emp_id, col_id) => {
  try {
      const resp = await Api.get(`/cch/last_cch/${emp_id}/${col_id}`);
      return resp;
  } catch (error) {
      console.error(error);
  }
}

// Retorna a quantidade de contracheques para um colocaborador
export const colaborador_get_count_cch = async (emp_id, col_id) => {
  try {
      const resp = await Api.get(`/cch/count/${emp_id}/${col_id}`);
      return resp;
  } catch (error) {
      console.error(error);
  }
}

export const colaborador_get_list_cch = async (emp_id, col_id) => {
  try {
      const resp = await Api.get(`/cch/list/${emp_id}/${col_id}`);
      // console.log('colaborador_get_list_cch: ', resp);
      const resultado = resp.map(item => ({
        cch_id: item.cch_id,
        ano: item.ano,
        mes: item.mes,
        valor_bruto: item.valor_bruto,
        valor_descontos: item.valor_descontos,
        valor_liquido: item.valor_liquido,
        file_url: item.file_url,
        name: item.name,
        entregue: item.entregue,
        entregue_em: item.entregue_em
      }));
      return resultado;
  } catch (error) {
      console.error(error);
  }
}

export const colaborador_download_cch = async (
    col_id, 
    cch_id, 
    tipo_acao = 'v', 
    ip_origem = null, 
    user_agent = null, 
    filename = null
) => {
  // console.log('colaborador_download_cch: ', col_id, cch_id, tipo_acao, ip_origem, user_agent);
  let data = { 
    col_id: col_id,
    cch_id: cch_id,
    tipo_acao: tipo_acao, 
    ip_origem: ip_origem, 
    user_agent: user_agent,
    file_name: filename
  }
  try {
        const resp_d = await Api.downloadFile(`/cch/downloadcch`, data);
        return resp_d;
    } catch (error) {
        console.error(error);
    }
}

export const colaborador_view_cch = async (
    col_id, 
    cch_id, 
    tipo_acao = 'v', 
    ip_origem = null, 
    user_agent = null) => 
{
  console.log('colaborador_view_cch: ', col_id, cch_id, tipo_acao, ip_origem, user_agent);
  let data = { 
    col_id: col_id,
    cch_id: cch_id,
    tipo_acao: tipo_acao, 
    ip_origem: ip_origem, 
    user_agent: user_agent
  }
  try {
      const resp_d = await Api.downloadBlob(`/cch/downloadcch`, data);
      console.log('colaborador_view_cch.resp', resp_d);
      return resp_d;
  } catch (error) {
      console.error('colaborador_view_cch.error', error);
  }
}

export const colaborador_ultimos_cchs = async (emp_id, col_id) => {
  console.log('cch_ultimos: ', emp_id, col_id)
  try {
    const resp = await Api.get(`cch/lastn/${emp_id}/${col_id}`, null);
    console.log('cch_ultimos: ', resp);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const colaborador_tempo_servico = async (emp_id, status) => {
  console.log('colaborador_tempo_servico: ', emp_id, status)
  try {
    const resp = await Api.get(`col/tempo_servico/${emp_id}/${status}`, null);
    console.log('colaborador_tempo_servico: ', resp);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const colaborador_faixa_etaria = async (emp_id, status) => {
  console.log('colaborador_faixa_etaria: ', emp_id, status)
  try {
    const resp = await Api.get(`col/faixa_etaria/${emp_id}/${status}`, null);
    console.log('colaborador_faixa_etaria: ', resp);
    return resp;
  } catch (error) {
    console.error(error);
  }
}

export const colaborador_qtd_sexo = async (emp_id, status) => {
  console.log('colaborador_qtd_sexo: ', emp_id, status)
  try {
    const resp = await Api.get(`col/qtd_sexo/${emp_id}/${status}`, null);
    console.log('colaborador_qtd_sexo: ', resp);
    return resp;
  } catch (error) {
    console.error(error);
  }
}