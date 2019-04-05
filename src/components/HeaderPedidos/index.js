import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderPedidos extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          <ButtonNew to='/pedidos/novo' tooltip='Novo pedido' />
        </div>
      </div>
    )
  }
}
