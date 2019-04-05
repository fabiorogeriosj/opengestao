const result = [
  { codigo: 1, nome: 'Produto teste 123', descricao: 'lorem ipsum dolores blablabla', preco: 333, codigoBarras: '12312312312' },
  { codigo: 2, nome: 'Produto teste asdasdsd', descricao: 'lorem ipsum dolores blablabla', preco: 333, codigoBarras: '12312312312' }
]

const getList = (search, filter) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(result)
    }, 200)
  })
}

module.exports = {
  getList
}
