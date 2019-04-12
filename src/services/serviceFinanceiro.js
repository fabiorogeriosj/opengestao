import moment from 'moment'

const getList = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
      const query = `select financeiro.id,
        clientes.fantasia, clientes.cnpj, DATE_FORMAT(financeiro.data_vencimento, "%d/%m/%Y") as data_vencimento,
        formas_pagamento.nome as forma_pagamento, financeiro.valor, financeiro.situacao, financeiro.tipo 
        from financeiro 
          inner join clientes on financeiro.cliente=clientes.id
          inner join formas_pagamento on financeiro.forma_pagamento=formas_pagamento.id
          ${where} 
        order by clientes.fantasia limit 100
      `
      const financeiro = await window.db.query(query)
      resolve(financeiro)
    } catch (error) {
      reject(error)
    }
  })
}

const save = async (conta) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!conta.id) {
        const inserted = await window.db.query(
          `insert into financeiro (cliente, valor, data_vencimento, forma_pagamento, situacao, tipo) values (?,?,?,?,?,?)`,
          [conta.cliente, conta.valor, moment(conta.data_vencimento).format('YYYY-MM-DD'), conta.forma_pagamento, conta.situacao, conta.tipo]
        )
        resolve(inserted)
      } else {
        const updated = await window.db.query(
          `update financeiro set cliente=?, valor=?, data_vencimento=?, forma_pagamento=?, situacao=?, tipo=?  where id=?`,
          [conta.cliente, conta.valor, moment(conta.data_vencimento).format('YYYY-MM-DD'), conta.forma_pagamento, conta.situacao, conta.tipo, conta.id]
        )
        resolve(updated)
      }
    } catch (error) {
      reject(error)
    }
  })
}

const get = async (id) => {
  return new Promise(async (resolve, reject) => {
    const query = `select * from financeiro where id=${id}`
    const financeiro = await window.db.query(query)
    resolve(financeiro[0])
  })
}

export {
  getList,
  save,
  get
}
