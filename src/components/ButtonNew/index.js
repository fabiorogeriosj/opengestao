import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import Tooltip from 'react-simple-tooltip'

export default class ButtonNew extends Component {
  render () {
    return (
      <Tooltip content={this.props.tooltip} placement='bottom' fontSize='12px'>
        <Link to={this.props.to}>
          <FaPlus className='icon' size='30' />
        </Link>
      </Tooltip>
    )
  }
}
