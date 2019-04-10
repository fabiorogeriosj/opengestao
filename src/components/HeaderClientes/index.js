import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderClientes extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          { this.props.label && (<p>Clientes > {this.props.label}</p>)}
          { !this.props.label && (
            <ButtonNew to='/clientes/cadastro' tooltip='Novo cliente' />
          )}
        </div>

      </div>
    )
  }
}
