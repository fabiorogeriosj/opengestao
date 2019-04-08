import React from 'react'
import ReactLoading from 'react-loading'

import './style.css'

export default ({ type = 'bars', color = 'rgba(0,0,0,0.5)', verticalAlign }) => (
  <div className='center'>
    { verticalAlign && (<div className='paddingCenterTop' />)}
    <ReactLoading type={type} color={color} />
    Carregando...
  </div>
)
