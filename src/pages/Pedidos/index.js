import React, { Component } from 'react'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { Redirect } from 'react-router-dom'

import HeaderPedidos from '../../components/HeaderPedidos'
import { Table, Form, Row, Col, Button } from 'react-bootstrap'
import Loading from '../../components/Loading'
import serviceUtil from '../../services/serviceUtil'

import * as servicePedidos from '../../services/servicePedidos'

export default class Clientes extends Component {
  state = {
    list: [],
    loading: true,
    filter: 'clientes.fantasia',
    search: ''
  }

  componentDidMount () {
    this.onSearch()
  }

  updateFild = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }

  onSearch = async () => {
    this.setState({
      loading: true
    })
    this.setState({
      loading: false,
      list: await servicePedidos.getList({ search: this.state.search, filter: this.state.filter })
    })
  }

  onPress = (event) => {
    if (event.key === 'Enter') {
      this.onSearch()
    }
  }

  edit = (id) => {
    this.setState({
      redirectEdit: true,
      id: id
    })
  }

  render () {
    return (
      <div className='content'>
        { this.state.redirectEdit && (<Redirect to={'/pedidos/cadastro/' + this.state.id} />)}
        <HeaderPedidos />
        <div className='list-filter'>
          <Row className='box-filter'>
            <Col xs={1.5}>
              <Form.Control as='select' value={this.state.filter} onChange={this.updateFild} id='filter'>
                <option value='clientes.fantasia'>Nome/Fantasia</option>
                <option value='clientes.cnpj'>CPF/CNPJ</option>
                <option value='pedidos'>Endereço</option>
                <option value='formas_pagamento.nome'>Forma pagamento</option>
              </Form.Control>
            </Col>
            <Col xs={3}>
              <Form.Control onKeyPress={this.onPress} type='search' placeholder='Procurar por...' value={this.state.search} onChange={this.updateFild} id='search' />
            </Col>
            <Col>
              <Button variant='primary' onClick={this.onSearch}>
                <FaSearch />
              </Button>
            </Col>
          </Row>
          { this.state.loading && <Loading />}
          { !this.state.loading && !this.state.list.length && (
            <div className='center'>
              <FaExclamationTriangle size={150} color='#ccc' />
              <div>Nenhum pedido cadastrado até o momento!</div>
            </div>
          ) }
          { !this.state.loading && this.state.list.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome/Fantasia</th>
                  <th>CPF/CNPJ</th>
                  <th>Data</th>
                  <th>Forma pagamento</th>
                  <th>Desconto</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                { this.state.list.map(item => (
                  <tr className={item.situacao === 'Cancelado' ? 'table-danger' : ''} key={item.id} onClick={() => this.edit(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.cliente}</td>
                    <td>{item.cnpj}</td>
                    <td>{item.data} {item.hora}</td>
                    <td>{item.forma_pagamento}</td>
                    <td>R$ {serviceUtil.formatReal(item.valor_desconto)}</td>
                    <td>R$ {serviceUtil.formatReal(item.total_pedido)}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </div>
    )
  }
}
