const getList = async (filter = {}) => {
  return new Promise(async (resolve, reject) => {
    const where = filter.search && filter.search !== '' ? `where ${filter.filter} like '%${filter.search}%'` : ''
    const query = `select * from formas_pagamento ${where} order by nome`
    const formas = await window.db.query(query)
    resolve(formas)
  })
}

export {
  getList
}
