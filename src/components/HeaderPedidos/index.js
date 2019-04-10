import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderPedidos extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          { this.props.label && (<p>Pedidos > {this.props.label}</p>)}
          { !this.props.label && (
            <ButtonNew to='/pedidos/cadastro' tooltip='Novo pedido' />
          )}
        </div>
      </div>
    )
  }
}
