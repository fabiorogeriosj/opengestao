import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderProdutos extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          { this.props.label && (<p>Produtos > {this.props.label}</p>)}
          { !this.props.label && (
            <ButtonNew to='/produtos/cadastro' tooltip='Novo produto' />
          )}
        </div>
      </div>
    )
  }
}
