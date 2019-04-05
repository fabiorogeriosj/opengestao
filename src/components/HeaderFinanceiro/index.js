import React, { Component } from 'react'
import ButtonNew from '../ButtonNew'

export default class HeaderFinanceiro extends Component {
  render () {
    return (
      <div className='sub-header'>
        <div className='box-sub-header'>
          <ButtonNew to='/financeiro/novo' tooltip='Nova conta' />
        </div>
      </div>
    )
  }
}
