
const formatReal = (number) => {
  if (!number || !Number(number)) return '0,00'

  return Number(number).toFixed(2).replace('.', ',')
}

module.exports = {
  formatReal
}
