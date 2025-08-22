export const lista_sexo = [
    {
        "id": "M",
        "nome": "Maculino",
    },
    {
        "id": "F",
        "nome": "Feminino",
    },
    {
        "id": "O",
        "nome": "Outro",
    },
];

export const lista_ufs = [
    {
        "uf": "SE",
        "nome": "Sergipe",
        "id_ibge": "28",
    },
    {
        "uf": "AL",
        "nome": "Alagoas",
        "id_ibge": "27",
    },
    {
        "uf": "BA",
        "nome": "Bahia",
        "id_ibge": "29",
    },
    {
        "uf": "PB",
        "nome": "Paraíba",
        "id_ibge": "25",
    },
    {
        "uf": "PE",
        "nome": "Pernambuco",
        "id_ibge": "26",
    },
];

export const lista_paises = [
    {
        "id_iso": "BRA",
        "nome": "Brasil",
        "id_ibge": "76",
    },
];

export const lista_estado_civil = [
    {   
        "id": "1",
        "nome": "CASADO(A)",
    },
    {   
        "id": "2",
        "nome": "DESQUITADO(A)",
    },
    {   
        "id": "3",
        "nome": "SEPARADO(A) JUDICIALMENTE",
    },
    {   
        "id": "4",
        "nome": "DIVORCIADO(A)",
    },
    {   
        "id": "5",
        "nome": "SOLTEIRO(A)",
    },
    {   
        "id": "6",
        "nome": "VIÚVO(A)",
    },
];

export const lista_status_funcionario = [
    {   
        "id": "1",
        "nome": "Ativo",
        "descricao": "Funcionários atualmente empregados e trabalhando.",
    },
    {   
        "id": "2",
        "nome": "Inativo",
        "descricao": "Funcionários que não estão mais empregados na empresa, mas cujo histórico de emprego ainda é mantido para fins de registro.",
    },
    {   
        "id": "3",
        "nome": "Afastado",
        "descricao": "Funcionários temporariamente fora do trabalho devido a razões como licença médica, licença-maternidade, licença-paternidade, ou outras licenças autorizadas.",
    },
    {   
        "id": "4",
        "nome": "Em Período de Experiência",
        "descricao": "Funcionários que estão no período inicial de emprego, geralmente avaliado para determinar a adequação ao cargo.",
    },
    {   
        "id": "5",
        "nome": "Aposentado",
        "descricao": "Funcionários que se aposentaram da empresa mas cujo status é mantido para fins de benefícios e registro.",
    },
    {   
        "id": "6",
        "nome": "Em Aviso Prévio",
        "descricao": "Funcionários que estão no período de aviso prévio, seja por demissão ou por pedido de desligamento, mas que ainda estão formalmente empregados até o término desse período.",
    },
    {   
        "id": "7",
        "nome": "Treinamento",
        "descricao": "Funcionários que estão passando por programas de treinamento ou capacitação.",
    },
    {   
        "id": "8",
        "nome": "Transferido",
        "descricao": "Funcionários que foram transferidos para uma posição ou localização diferente dentro da empresa.",
    },
    {   
        "id": "9",
        "nome": "Suspenso",
        "descricao": "Funcionários que estão temporariamente afastados do trabalho como resultado de medidas disciplinares.",
    },
    {   
        "id": "10",
        "nome": "Contratado Temporário",
        "descricao": "Funcionários que estão trabalhando por um período limitado, geralmente com um contrato que especifica a duração do emprego.",
    },
];

export const tipos_contratos = [
    {
        "id": "0",
        "nome": "Sócio",
        "sigla": "Sócio",
        "descricao": "Sócio da empresa.",
    },
    {
        "id": "1",
        "nome": "CLT",
        "sigla": "CLT",
        "descricao": "Consolidação das Leis do Trabalho.",
    },
    {   
        "id": "2",
        "nome": "PJ",
        "sigla": "PJ",
        "descricao": "Pessoa Jurídica.",
    },
    {   
        "id": "3",
        "nome": "Freelancer",
        "sigla": "FL",
        "descricao": "Contratação para a realização de tarefas ou projetos específicos, sem vínculo empregatícioócio da empresa.",
    },
    {   
        "id": "5",
        "nome": "Autônoma",
        "sigla": "AUT",
        "descricao": "Profissionais que prestam serviços de forma independente, sem vínculo empregatício. ",
    },
    {   
        "id": "6",
        "nome": "Estagiário",
        "sigla": "EST",
        "descricao": "Para estudantes que ainda estão cursando ensino médio, técnico, ou superior.",
    },
];

export const lista_perfil_funcionario = [
    {
        "id": "4",
        "nome": "Funcionário",
        "sigla": "Func",
        "descricao": "Funcionário da empresa.",
    },
    {
        "id": "5",
        "nome": "Gerente",
        "sigla": "Ger",
        "descricao": "Gerente da empresa.",
    },
    {
        "id": "1",
        "nome": "Admin",
        "sigla": "Admin",
        "descricao": "Administrativo da empresa.",
    },
];

export const enum_perfil_funcionario = {
    FUNCIONARIO : "Funcionário", 
    COORDENADOR : "Coordenador",
    ADMIN : "Admin",
}

export const lista_sim_nao = [
    {
        "id": "1", 
        "nome": "SIM",
    }, 
    {
        "id": "0", 
        "nome": "NÃO",
    }
];


export const lista_grau_instrucao = [
    {
        "id": "1",
        "nome": "Lê e Escreve",
    },
    {
        "id": "2",
        "nome": "Ensino Fundamental Incompleto",
    },
    {
        "id": "3",
        "nome": "Ensino Fundamental Completo",
    },
    {
        "id": "4",
        "nome": "Ensino Médio Incompleto",
    },
    {
        "id": "5",
        "nome": "Ensino Médio Completo",
    },
    {
        "id": "6",
        "nome": "Superior Incompleto",
    },
    {
        "id": "7",
        "nome": "Superior Completo",
    },
    {
        "id": "8",
        "nome": "Pós Graduado-Especialização",
    },
    {
        "id": "9",
        "nome": "Pós Graduado-Mestrato",
    },
    {
        "id": "10",
        "nome": "Pós Graduado-Doutorado",
    },
]

export const lista_cor = [
    {
        "id": "1", 
        "nome": "Branca",
    }, 
    {
        "id": "2", 
        "nome": "Preta",
    }, 
    {
        "id": "3", 
        "nome": "Parda",
    }, 
    {
        "id": "4", 
        "nome": "Amarela",
    }, 
    {
        "id": "5", 
        "nome": "Indigena",
    }, 
    {
        "id": "6", 
        "nome": "Sem Informação",
    },
]

export const lista_meses = {
    1: "Janeiro",
    2: "Fevereiro",
    3: "Março",
    4: "Abril",
    5: "Maio",
    6: "Junho",
    7: "Julho",
    8: "Agosto",
    9: "Setembro",
    10: "Outubro",
    11: "Novembro",
    12: "Dezembro",
}

export const CLASSIFICACAO_ARQUIVO_MAP = {
  0: "Escolha a Classificação",
  1: "Contra Cheque",
  2: "Dados Financeiros (ofx)",
  3: "Outros"
};

export function getNomeClassificacaoPorId(id) {
  return CLASSIFICACAO_ARQUIVO_MAP[id] || "Classificação Desconhecida";
}

export const lista_classificacao_arquivo = Object.entries(CLASSIFICACAO_ARQUIVO_MAP).map(([id, nome]) => ({
  id: Number(id),
  nome
}));

const STATUS_ARQUIVO_MAP = {
    // Arquivo aguardando início do processamento
    0: {
        nome: "Pendente",
        cor: "grey",
        icon: "mdi-timer-sand"
    },
    // Em processamento
    1: {
        nome: "Em Processamento",
        cor: "blue-grey",
        icon: "mdi-file-clock"
    },
    // Processado corretamente
    2: {
        nome: "Processado",
        cor: "green",
        icon: "mdi-check-circle-outline"
    },
    // Ocorreu uma falha durante o processamento
    3: {
        nome: "Erro no Processamento",
        cor: "red",
        icon: "mdi-alert-circle-outline"
    },
    // Arquivo não requer processamento (uso informativo)
    4: {
        nome: "Não Necessário",
        cor: "primary",
        icon: "mdi-minus-circle-outline"
    }     
};

export function getNomeStatusArquivoById(id) {
  return STATUS_ARQUIVO_MAP[id] || { 
    nome: "Status Desconhecido",
    cor: "grey",
    icon: "mdi-help-circle-outline"
  };
}

export const lista_status_arquivo = Object.entries(STATUS_ARQUIVO_MAP).map(([id, value]) => ({
  id: Number(id),
  ...value
}));

const SIM_NAO = {
    1: {
        nome: "SIM",
        cor: "indigo",
        icon: "mdi-check-circle-outline"
    },
    0: {
        nome: "NÃO",
        cor: "warning",
        icon: "mdi-close-circle-outline"
    },
}

export function getSimNao(id) {
    const chave = id === true || id === 1 ? 1 :
                id === false || id === 0 ? 0 :
                id;
    return SIM_NAO[chave] || { 
        nome: "Desconhecido",
        cor: "grey",
        icon: "mdi-help-circle-outline"
    };
}

