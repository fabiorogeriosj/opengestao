const login = (username, password) => {
  return new Promise(async (resolve, reject) => {
    const user = await window.db.query(`select * from usuario where usuario=? and senha=?`, [username, password])
    console.log(user)
    if (!user || !user.length) return reject('Usuário ou senha não confere!'.toString())
    resolve(user[0])
  })
}

export {
  login
}