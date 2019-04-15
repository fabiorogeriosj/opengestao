const getList = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
      const query = `select 
        comissoes.*,
        clientes.fantasia as cliente, pedidos.id as pedido, usuario.nome as usuario, 
        DATE_FORMAT(comissoes.data_pedido, "%d/%m/%Y") as data_pedido
        from comissoes inner join usuario on usuario.id=comissoes.usuario
        inner join clientes on clientes.id=comissoes.cliente
        inner join pedidos on pedidos.id=comissoes.pedido
        ${where} order by comissoes.id limit 100`
      const comissoes = await window.db.query(query)
      resolve(comissoes)
    } catch (error) {
      reject(error)
    }
  })
}

const save = async (comissao) => {
  return new Promise(async (resolve, reject) => {
    if (!comissao.id) {
      const inserted = await window.db.query(
        `insert into comissoes 
        (usuario, cliente, valor_pedido, data_pedido, pedido, valor_comissao, situacao)
         values 
         (
             (select usuario from pedidos where id=${comissao.pedido}),
             (select cliente from pedidos where id=${comissao.pedido}),
             (select total_pedido from pedidos where id=${comissao.pedido}),
             (select data from pedidos where id=${comissao.pedido}),
             ?,?,?)`,
        [comissao.pedido, comissao.valor_comissao, comissao.situacao]
      )
      resolve(inserted)
    } else {
      const updated = await window.db.query(
        `update comissoes set 
        usuario=(select usuario from pedidos where id=${comissao.pedido}), 
        cliente=(select cliente from pedidos where id=${comissao.pedido}), 
        valor_pedido=(select total_pedido from pedidos where id=${comissao.pedido}), 
        data_pedido=(select data from pedidos where id=${comissao.pedido}), 
        pedido=?, valor_comissao=?, situacao=? where id=?`,
        [comissao.pedido, comissao.valor_comissao, comissao.situacao, comissao.id]
      )
      resolve(updated)
    }
  })
}

const get = async (id) => {
  return new Promise(async (resolve, reject) => {
    const query = `select 
    comissoes.*,
    clientes.fantasia as cliente, pedidos.id as pedido, usuario.nome as usuario, 
    DATE_FORMAT(comissoes.data_pedido, "%d/%m/%Y") as data_pedido
    from comissoes inner join usuario on usuario.id=comissoes.usuario
    inner join clientes on clientes.id=comissoes.cliente
    inner join pedidos on pedidos.id=comissoes.pedido where comissoes.id=${id}`
    const comissoes = await window.db.query(query)
    resolve(comissoes[0])
  })
}

export {
  getList,
  save,
  get
}
