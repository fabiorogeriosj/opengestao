
const get = async () => {
  return new Promise(async (resolve, reject) => {
    const query = `select * from configuracoes limit 1`
    const config = await window.db.query(query)
    resolve(config[0])
  })
}

export {
  get
}
