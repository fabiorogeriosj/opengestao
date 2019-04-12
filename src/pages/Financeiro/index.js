import React, { Component } from 'react'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { Redirect } from 'react-router-dom'

import HeaderFinanceiro from '../../components/HeaderFinanceiro'
import { Table, Input, Row, Col, Button, Alert } from 'reactstrap'
import Loading from '../../components/Loading'

import * as serviceFinanceiro from '../../services/serviceFinanceiro'
import serviceUtil from '../../services/serviceUtil'

export default class Financeiro extends Component {
  state = {
    list: [],
    loading: true,
    filter: 'financeiro.tipo',
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
    try {
      this.setState({
        loading: false,
        list: await serviceFinanceiro.getList({ search: this.state.search, filter: this.state.filter })
      })
    } catch (error) {
      console.log(error)
      this.setState({ loading: false })
      window.alert.error(error)
    }
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
        { this.state.redirectEdit && (<Redirect to={'/financeiro/cadastro/' + this.state.id} />)}
        <HeaderFinanceiro />
        <div className='list-filter'>
          <Row className='box-filter'>
            <Col xs={1.5}>
              <Input type='select' value={this.state.filter} onChange={this.updateFild} id='filter'>
                <option value='financeiro.tipo'>Tipo da conta</option>
                <option value='financeiro.data_vencimento'>Data de vencimento</option>
                <option value='formas_pagamento.nome'>Forma de pagamento</option>
                <option value='situacao'>Situação da conta</option>
                <option value='cliente.fantasia'>Nome/Fantasia</option>
                <option value='cliente.cnpj'>CPF/CNPJ</option>
                <option value='cliente.endereco'>Endereço</option>
                <option value='cliente.telefone'>Telefone</option>
                <option value='cliente.email'>E-mail</option>
                <option value='cliente.cidade'>Cidade</option>
                <option value='cliente.uf'>UF</option>
              </Input>
            </Col>
            <Col xs={3}>
              <Input onKeyPress={this.onPress} type='search' placeholder='Procurar por...' value={this.state.search} onChange={this.updateFild} id='search' />
            </Col>
            <Col>
              <Button color='primary' onClick={this.onSearch}>
                <FaSearch />
              </Button>
            </Col>
          </Row>
          { this.state.loading && <Loading />}
          { !this.state.loading && !this.state.list.length && (
            <div className='center'>
              <FaExclamationTriangle size={150} color='#ccc' />
              <div>Nenhuma conta cadastrada até o momento!</div>
            </div>
          ) }
          { !this.state.loading && this.state.list.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome/Fantasia</th>
                  <th>CPF/CNPJ</th>
                  <th>Data vencimento</th>
                  <th>Forma pagamento</th>
                  <th>Valor</th>
                  <th>Situação</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                { this.state.list.map(item => (
                  <tr key={item.id} onClick={() => this.edit(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.fantasia}</td>
                    <td>{item.cnpj}</td>
                    <td>{item.data_vencimento}</td>
                    <td>{item.forma_pagamento}</td>
                    <td>R$ {serviceUtil.formatReal(item.valor)}</td>
                    <td>{item.situacao}</td>
                    <td>
                      { item.tipo === 'A receber' && <Alert color='success'>A receber</Alert> }
                      { item.tipo === 'A pagar' && <Alert color='danger'>A pagar</Alert> }
                    </td>
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
