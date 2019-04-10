import moment from 'moment'

const getList = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
      const query = `select pedidos.id,
      clientes.fantasia as cliente, clientes.cnpj, DATE_FORMAT(pedidos.data, "%d/%m/%Y") as data, usuario.nome as usuario,
      formas_pagamento.nome as pagamento, pedidos.valor_desconto, pedidos.total_pedido, pedidos.status 
      from pedidos 
        inner join clientes on pedidos.cliente=clientes.id
        inner join formas_pagamento on pedidos.pagamento=formas_pagamento.id
        inner join usuario on pedidos.usuario=usuario.id
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

const save = async (pedido) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!pedido.id) {
        const urlPedido = 'insert into pedidos (cliente, usuario, observacao, data, pagamento, valor_desconto, total_pedido, status) values (?,?,?,?,?,?,?,?)'
        const paramsPedido = [pedido.cliente, pedido.usuario, pedido.observacao, moment(pedido.data).format('YYYY-MM-DD'), pedido.pagamento, pedido.valor_desconto, pedido.total_pedido, pedido.status]
        const inserted = await window.db.query(urlPedido, paramsPedido)

        pedido.itens.map(async (item) => {
          const urlItem = 'insert into itens_pedido (id_pedido, produto, quantidade, observacao, valor_unitario, valor_desconto, valor_total) values (?,?,?,?,?,?,?)'
          const paramsItem = [inserted.insertId, item.produto, item.quantidade, item.observacao, item.valor_unitario, item.valor_desconto, item.valor_total]
          const insertedItem = await window.db.query(urlItem, paramsItem)
          return insertedItem
        })
        resolve()
      } else {
        await window.db.query(
          `update pedidos set usuario=?, cliente=?, observacao=?, data=?, pagamento=?, valor_desconto=?, total_pedido=?, status=? where id=?`,
          [pedido.usuario, pedido.cliente, pedido.observacao, moment(pedido.data).format('YYYY-MM-DD'), pedido.pagamento, pedido.valor_desconto, pedido.total_pedido, pedido.status, pedido.id]
        )

        pedido.itens.map(async (item) => {
          await window.db.query('delete from itens_pedido where id_pedido=?', [pedido.id])
          await window.db.query(
            'insert into itens_pedido (id_pedido, produto, quantidade, observacao, valor_unitario, valor_desconto, valor_total) values (?,?,?,?,?,?,?)',
            [pedido.id, item.produto, item.quantidade, item.observacao, item.valor_unitario, item.valor_desconto, item.valor_total]
          )
          return item
        })
        resolve()
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

const getItens = async (id) => {
  return new Promise(async (resolve, reject) => {
    const query = `select *, produtos.nome as produto_nome from itens_pedido inner join produtos on itens_pedido.produto=produtos.id where id_pedido=${id}`
    const itens = await window.db.query(query)
    resolve(itens)
  })
}

export {
  getList,
  save,
  get,
  getItens
}
