export const menu_admin = [
    {
      icon: 'mdi-view-dashboard-variant-outline', 
      title: 'Inicio',
      to: 'dashadmin',  
      value: 'dashadmin',
    },
    {
      title: 'Financeiro',
      value: 'finan',
      icon: 'mdi-cash-multiple',
      children: [
          { 
            title: 'Banco', 
            icon: 'mdi-bank', 
            to: 'banco', 
            value: 'banco', 
            disabled: false
          },
          { title: 'Contas Bancárias', icon: 'mdi-account-cash-outline', to: 'conta', value: 'conta', disabled: false },
          { title: 'Pagar/Receber', icon: 'mdi-cash-sync', to: 'pagrec', value: 'pagrec', disabled: true },
          { title: 'Extratos', icon: 'mdi-invoice-list-outline', to: 'extrato', value: 'extrato', disabled: false },
          { title: 'Conciliação', icon: 'mdi-cash-check', to: 'concil', value: 'concil', disabled: true },
      ]
    },
    {
      contract_title: 'Funcion.',
      title: 'Funcionário',
      value: 'func',
      icon: 'mdi-account-multiple',
      children: [
          { 
            title: 'Todos', 
            icon: 'mdi-table-account', 
            value: 'func', 
            disabled: false
          },
          { 
            title: 'Novo', 
            icon: 'mdi-account-plus-outline', 
            value: 'func/novo', 
            disabled: false
          },
          { title: 'Contra-Cheques', icon: 'mdi-account-cash-outline',  value: 'cch', disabled: false },
          
      ]
    },
    {
      contract_title: 'Arquivo',
      title: 'Arquivo',
      value: 'arquivo',
      icon: 'mdi-account-multiple',
      children: [
          { 
            title: 'Todos', 
            icon: 'mdi-table-account', 
            value: 'arquivo', 
            disabled: false
          },
          { 
            title: 'Novo', 
            icon: 'mdi-account-plus-outline', 
            value: 'arquivo/novo', 
            disabled: false
          }         
      ]
    }
]

export const menu_funcionario = [
    {
        title: 'Inicio',
        icon: 'mdi-view-dashboard-variant-outline',
        value: 'dashfuncionario',
        to: 'dashfuncionario',
    },
    // {
    //     title: 'Meus Dados',
    //     contract_title: 'Dados',
    //     icon: 'mdi-account-box-edit-outline',
    //     value: 'rendirpf',
    //     to: 'rendirpf',
    //     disabled: true
    // },
    {
        title: 'Contraheque',
        // title: 'Holerite',
        icon: 'mdi-account-cash-outline',
        value: 'cchfuncionario',
        to: 'cchfuncionario',
    },
    // {
    //     title: 'Carreira',
    //     icon: 'mdi-briefcase-search-outline',
    //     value: 'rendirpf',
    //     to: 'rendirpf',
    //     disabled: true
    // },
    // {
    //     title: 'Rendimentos IRPF',
    //     contract_title: 'Rend IRPF',
    //     icon: 'mdi-ticket-percent-outline',
    //     value: 'rendirpf',
    //     to: 'rendirpf',
    //     disabled: true
    // },
    // {
    //     title: 'Ficha Financeira Anual',
    //     contract_title: 'Fin. Anual',
    //     icon: 'mdi-cash-clock',
    //     value: 'rendirpf',
    //     to: 'rendirpf',
    //     disabled: true
    // },
    // {
    //     title: 'Férias',
    //     icon: 'mdi-calendar-star',
    //     value: 'rendirpf',
    //     to: 'rendirpf',
    //     disabled: true
    // },
    {
        title: 'Simulações de Crédito',
        contract_title: 'Simulação',
        icon: 'mdi-finance',
        value: 'simulacao',
        to: 'simulacao',
        disabled: true,
    },
    {
        title: 'Adiantamento Salarial',
        contract_title: 'Adianta.',
        icon: 'mdi-cash-fast',
        value: 'adiantamento',
        to: 'adiantamento',
        disabled: true,
    },
];

// export const menu_admin = [
//     { 
//         type: 'menu-title',
//         text: {
//             description: 't-menu', 
//             isInternationalization: true,
//         },
//     },
//     {
//         type: 'nav-item',
//         to: '',
//         datakey: 't-dashboards',
//         icon: 'ri-dashboard-2-line',
//         text: {
//             description: 't-dashboards', 
//             isInternationalization: true
//         },
//         itens: [
//             {
//                 type: 'nav-item',
//                 to: '/dashboard/funcionario',
//                 text: {
//                     description: 't-dash-func', 
//                     isInternationalization: true
//                 },
//             },
//             {
//                 type: 'nav-item',
//                 to: '/dashboard/admin',
//                 text: {
//                     description: 't-dash-admin', 
//                     isInternationalization: true
//                 },

//             }
//         ],
//     },
//     {
//         type: 'nav-item',
//         to: '',
//         datakey: 't-contracheque',
//         icon: 'ri-refund-2-line',
//         text: {
//             description: 't-contracheque', 
//             isInternationalization: true
//         },
//         itens: [
//             {
//                 type: 'nav-item',
//                 to: '/contracheque/admin',
//                 text: {
//                     description: 't-contracheque-main', 
//                     isInternationalization: true
//                 },
//             },
//             {
//                 type: 't-contracheque-new',
//                 to: '/contracheque/admin/nova',
//                 text: {
//                     description: 't-contracheque-new', 
//                     isInternationalization: true
//                 },

//             },
//         ],
//     },
//     {
//         type: 'nav-item',
//         to: '',
//         datakey: 't-folha',
//         icon: 'ri-refund-line',
//         text: {
//             description: 't-folha', 
//             isInternationalization: true
//         },
//         itens: [
//             {
//                 type: 'nav-item',
//                 to: '/contracheque/admin',
//                 text: {
//                     description: 't-contracheque-main', 
//                     isInternationalization: true
//                 },
//             },
//             {
//                 type: 't-contracheque-new',
//                 to: '/contracheque/admin/nova',
//                 text: {
//                     description: 't-contracheque-new', 
//                     isInternationalization: true
//                 },

//             },
//         ],
//     },
//     {
//         type: 'nav-item',
//         to: '/funcionario/',
//         datakey: 't-funcionarios',
//         icon: 'ri-team-line',
//         text: {
//             description: 't-funcionarios', 
//             isInternationalization: true
//         },
//     },
//     {
//         type: 'nav-item',
//         icon: 'ri-file-line',
//         // icon: 'ri-file-cloud-line',
//         datakey: 't-files',
//         text: { description: 't-files', isInternationalization: true },
//         itens: [
//             {
//                 to: '/arquivo',
//                 text: { description: 'Listar Arquivos', isInternationalization: false },
//             },
//             {
//                 to: '/arquivo/novo',
//                 text: { description: 'Novo Arquivo', isInternationalization: false },
//             },
//         ],
//     },
//     {
//         type: 'nav-item',
//         icon: 'ri-cash-line',
//         datakey: 't-finance',
//         text: { description: 't-finance', isInternationalization: true },
//         itens: [
//             {
//                 to: '/banco',
//                 text: { description: 't-bank', isInternationalization: true },
//             },
//             {
//                 to: '/conta',
//                 text: { description: 't-account', isInternationalization: true },
//             },
//         ],
//     },
//     {
//         type: 'nav-item',
//         to: '/conta/',
//         icon: 'ri-wallet-line',
//         datakey: 't-account',
//         text: { description: 't-account', isInternationalization: true },
//     },
// ];

// const items_bk = [
//       { icon: 'mdi-view-dashboard-variant-outline', title: 'Inicio', value: 'admin'},
//       { icon: 'mdi-view-dashboard-variant-outline', title: 'Funcionario', value: 'func' },
//       { icon: 'mdi-home-group', title: 'Estados', value: 'uf' },
//       { icon: 'mdi-home', title: 'Cidades', value: 'cidade' },
//       { icon: 'mdi-library-outline', title: 'Campi', value: 'campi'},
//       { icon: 'mdi-google-classroom', title: 'Cursos', value: 'cursos', disabled: true},
//       { icon: 'mdi-google-classroom', title: 'Admin', value: 'admin', disabled: false},
//       { icon: 'mdi-cast-education', title: 'Formas de Ensino', value: 'formas_ensino', disabled: true},
//       { icon: 'mdi-calendar-plus', title: 'Calendários', value: 'calendario', disabled: true},
//       { icon: 'mdi-account-tie', title: 'Professor', value: 'professor', disabled: true},
//       { icon: 'mdi-school', title: 'A', value: 'a', disabled: true},
//       { icon: 'mdi-star', title: 'Starred', value: 'starred', disabled: true},
// ]