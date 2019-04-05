import React, { Component } from 'react'
import { HashRouter, Route, Redirect } from 'react-router-dom'

import Pedidos from '../Pedidos'
import Clientes from '../Clientes'
import Produtos from '../Produtos'
import ProdutosCadastro from '../ProdutosCadastro'
import Financeiro from '../Financeiro'

import Header from '../../components/Header'

class App extends Component {
  state = {
    menuSelected: ''
  }
  changeMenu = (menuSelected) => {
    this.setState({ menuSelected })
  }
  render () {
    return (
      <HashRouter>
        <div>
          <Header changeMenu={this.changeMenu} />
          <Route exact path='/' render={() => <Redirect to='/pedidos' />} />
          <Route path='/pedidos' exact component={Pedidos} />
          <Route path='/clientes' exact component={Clientes} />
          <Route path='/produtos' exact component={Produtos} />
          <Route path='/produtos/cadastro' component={ProdutosCadastro} />
          <Route path='/financeiro' exact component={Financeiro} />
        </div>
      </HashRouter>
    )
  }
}

export default App
