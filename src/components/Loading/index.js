import React from 'react'
import ReactLoading from 'react-loading'

export default ({ type = 'bars', color = 'rgba(0,0,0,0.5)' }) => (
  <div className='center'>
    <ReactLoading type={type} color={color} />
    Carregando...
  </div>
)
