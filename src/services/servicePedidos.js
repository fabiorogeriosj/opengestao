import moment from 'moment'

const getList = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
      const query = `select pedidos.id,
      clientes.fantasia, clientes.cnpj, DATE_FORMAT(pedidos.data, "%d/%m/%Y") as data,
      formas_pagamento.nome as forma_pagamento, pedidos.valor_desconto, pedidos.total_pedido, pedidos.status 
      from pedidos 
        inner join clientes on pedidos.cliente=clientes.id
        inner join formas_pagamento on pedidos.pagamento=formas_pagamento.id
        ${where} 
      order by clientes.fantasia limit 100
    `
      const pedidos = await window.db.query(query)
      resolve(pedidos)
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
          `insert into pedidos (cliente, valor, data_vencimento, forma_pagamento, situacao, tipo) values (?,?,?,?,?,?)`,
          [conta.cliente, conta.valor, moment(conta.data_vencimento).format('YYYY-MM-DD'), conta.forma_pagamento, conta.situacao, conta.tipo]
        )
        resolve(inserted)
      } else {
        const updated = await window.db.query(
          `update pedidos set cliente=?, valor=?, data_vencimento=?, forma_pagamento=?, situacao=?, tipo=?  where id=?`,
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
    const query = `select * from pedidos where id=${id}`
    const pedidos = await window.db.query(query)
    resolve(pedidos[0])
  })
}

export {
  getList,
  save,
  get
}
