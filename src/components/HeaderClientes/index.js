import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderClientes extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          <ButtonNew to='/clientes/novo' tooltip='Novo cliente' />
        </div>
      </div>
    )
  }
}
