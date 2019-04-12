const getList = async (filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
      const query = `select * from clientes ${where} order by fantasia limit 100`
      const clientes = await window.db.query(query)
      resolve(clientes)
    } catch (error) {
      reject(error)
    }
  })
}

const getAllWithoutLimit = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `select * from clientes order by fantasia`
      const clientes = await window.db.query(query)
      resolve(clientes)
    } catch (error) {
      reject(error)
    }
  })
}

const save = async (cliente) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!cliente.id) {
        const inserted = await window.db.query(
          `insert into clientes (razao, fantasia, cnpj, endereco, telefone, email, cidade, uf, situacao) values (?,?,?,?,?,?,?,?,?)`,
          [cliente.razao, cliente.fantasia, cliente.cnpj, cliente.endereco, cliente.telefone, cliente.email, cliente.cidade, cliente.uf, cliente.situacao]
        )
        resolve(inserted)
      } else {
        const updated = await window.db.query(
          `update clientes set razao=?, fantasia=?, cnpj=?, endereco=?, telefone=?, email=?, cidade=?, uf=?, situacao=? where id=?`,
          [cliente.razao, cliente.fantasia, cliente.cnpj, cliente.endereco, cliente.telefone, cliente.email, cliente.cidade, cliente.uf, cliente.situacao, cliente.id]
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
    try {
      const query = `select * from clientes where id=${id}`
      const clientes = await window.db.query(query)
      resolve(clientes[0])
    } catch (error) {
      reject(error)
    }
  })
}

export {
  getList,
  save,
  get,
  getAllWithoutLimit
}
