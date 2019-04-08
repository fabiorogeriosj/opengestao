const getList = (search, filter) => {
  return window.select('select * from produtos order by nome')
}

export {
  getList
}
