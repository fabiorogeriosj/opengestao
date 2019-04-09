const getList = async (filter) => {
  return new Promise(async (resolve, reject) => {
    console.log(filter)
    const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
    const query = `select * from produtos ${where} order by nome limit 100`
    console.log(query)
    const products = await window.db.query(query)
    resolve(products)
  })
}

const save = async (produto) => {
  return new Promise(async (resolve, reject) => {
    if (!produto.id) {
      const inserted = await window.db.query(
        `insert into produtos (nome, descricao, preco, estoque, maximo_desconto) values (?,?,?,?,?)`,
        [produto.nome, produto.descricao || 'Não informado!', produto.preco, produto.estoque, produto.maximo_desconto]
      )
      resolve(inserted)
    } else {
      const updated = await window.db.query(
        `update produtos set nome=?, descricao=?, preco=?, estoque=?, maximo_desconto=? where id=?`,
        [produto.nome, produto.descricao || 'Não informado!', produto.preco, produto.estoque, produto.maximo_desconto, produto.id]
      )
      resolve(updated)
    }
  })
}

const get = async (id) => {
  return new Promise(async (resolve, reject) => {
    const query = `select * from produtos where id=${id}`
    const products = await window.db.query(query)
    resolve(products[0])
  })
}

export {
  getList,
  save,
  get
}
