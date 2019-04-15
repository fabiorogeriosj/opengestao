import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderComissoes extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          { this.props.label && (<p>Comissões > {this.props.label}</p>)}
          { !this.props.label && (
            <ButtonNew to='/comissoes/cadastro' tooltip='Nova comissão' />
          )}
        </div>
      </div>
    )
  }
}
