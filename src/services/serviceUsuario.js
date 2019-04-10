const login = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await window.db.query(`select * from usuario where usuario=? and senha=?`, [username, password])
      if (!user || !user.length) return reject('Usuário ou senha não confere!'.toString())
      resolve(user[0])
    } catch (error) {
      reject(error)
    }
  })
}

export {
  login
}
