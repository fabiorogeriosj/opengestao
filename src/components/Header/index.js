import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import './style.css'

export default class Header extends Component {
  state = {
    menuSelected: ''
  }

  async componentWillMount () {
    try {
      var menuSelected = ''
      if (window.location.hash.indexOf('pedidos') !== -1) menuSelected = 'menu-pedidos'
      else if (window.location.hash.indexOf('clientes') !== -1) menuSelected = 'menu-clientes'
      else if (window.location.hash.indexOf('produtos') !== -1) menuSelected = 'menu-produtos'
      else if (window.location.hash.indexOf('financeiro') !== -1) menuSelected = 'menu-financeiro'
      else if (window.location.hash.indexOf('comissoes') !== -1) menuSelected = 'menu-comissoes'
      else menuSelected = 'menu-pedidos'

      this.setState({
        menuSelected
      })
      this.props.changeMenu(menuSelected)
    } catch (error) {

    }
  }

  selectMenu = event => {
    this.setState({
      menuSelected: event.target.id
    })
    this.props.changeMenu(event.target.id)
  }

  render () {
    return (
      <div className='header'>
        <Link id='menu-pedidos' className={this.state.menuSelected === 'menu-pedidos' ? 'selected' : ''} to='/pedidos' onClick={this.selectMenu}>Pedidos</Link>
        <Link id='menu-produtos' className={this.state.menuSelected === 'menu-produtos' ? 'selected' : ''} to='/produtos' onClick={this.selectMenu}>Produtos</Link>
        <Link id='menu-clientes' className={this.state.menuSelected === 'menu-clientes' ? 'selected' : ''} to='/clientes' onClick={this.selectMenu}>Clientes</Link>
        <Link id='menu-financeiro' className={this.state.menuSelected === 'menu-financeiro' ? 'selected' : ''} to='/financeiro' onClick={this.selectMenu}>Financeiro</Link>
        <Link id='menu-comissoes' className={this.state.menuSelected === 'menu-comissoes' ? 'selected' : ''} to='/comissoes' onClick={this.selectMenu}>Comissões</Link>
      </div>
    )
  }
}
