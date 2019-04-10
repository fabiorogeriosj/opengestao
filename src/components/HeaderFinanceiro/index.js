import React, { Component, Fragment } from 'react'
import ButtonNew from '../ButtonNew'
import ButtonCategory from '../ButtonCategory'

export default class HeaderFinanceiro extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          { this.props.label && (<p>Financeiro > {this.props.label}</p>)}
          { !this.props.label && (
            <Fragment>
              <ButtonNew to='/financeiro/cadastro' tooltip='Nova conta' />
              <ButtonCategory to='/financeiro/forma_pagamento' tooltip='Forma de Pagamento' />
            </Fragment>
          )}
        </div>
      </div>
    )
  }
}
