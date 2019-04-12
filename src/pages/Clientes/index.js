import React, { Component } from 'react'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { Redirect } from 'react-router-dom'

import HeaderClientes from '../../components/HeaderClientes'
import { Table, Input, Row, Col, Button } from 'reactstrap'
import Loading from '../../components/Loading'

import * as serviceClientes from '../../services/serviceClientes'

export default class Clientes extends Component {
  state = {
    list: [],
    loading: true,
    filter: 'fantasia',
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
      list: await serviceClientes.getList({ search: this.state.search, filter: this.state.filter })
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
        { this.state.redirectEdit && (<Redirect to={'/clientes/cadastro/' + this.state.id} />)}
        <HeaderClientes />
        <div className='list-filter'>
          <Row className='box-filter'>
            <Col xs={1.5}>
              <Input type='select' value={this.state.filter} onChange={this.updateFild} id='filter'>
                <option value='fantasia'>Nome/Fantasia</option>
                <option value='cnpj'>CPF/CNPJ</option>
                <option value='endereco'>Endereço</option>
                <option value='telefone'>Telefone</option>
                <option value='email'>E-mail</option>
                <option value='cidade'>Cidade</option>
                <option value='uf'>UF</option>
                <option value='situacao'>Situação</option>
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
              <div>Nenhum cliente cadastrado até o momento!</div>
            </div>
          ) }
          { !this.state.loading && this.state.list.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome/Fantasia</th>
                  <th>CPF/CNPJ</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Cidade/UF</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                { this.state.list.map(item => (
                  <tr className={item.situacao === 'Inativo' ? 'table-danger' : ''} key={item.id} onClick={() => this.edit(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.fantasia}</td>
                    <td>{item.cnpj}</td>
                    <td>{item.telefone}</td>
                    <td>{item.email}</td>
                    <td>{item.cidade}/{item.uf}</td>
                    <td>{item.situacao}</td>
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
