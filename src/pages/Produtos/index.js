import React, { Component } from 'react'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'

import HeaderProdutos from '../../components/HeaderProdutos'
import { Table, Form, Row, Col, Button } from 'react-bootstrap'
import Loading from '../../components/Loading'

import serviceProdutos from '../../services/serviceProdutos'
import serviceUtil from '../../services/serviceUtil'

export default class Produtos extends Component {
  state = {
    list: [],
    loading: true,
    filter: 'nome',
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
      list: await serviceProdutos.getList({ search: this.state.search, filter: this.state.filter })
    })
  }

  onPress = (event) => {
    if (event.key === 'Enter') {
      this.onSearch()
    }
  }

  render () {
    return (
      <div>
        <HeaderProdutos />
        <div className='list-filter'>
          <Row>
            <Col xs={1.5}>
              <Form.Control as='select' value={this.state.filter} onChange={this.updateFild} id='filter'>
                <option value='nome'>Nome</option>
                <option value='descricao'>Descrição</option>
                <option value='codigo'>Código</option>
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
          <hr />
          { this.state.loading && <Loading />}
          { !this.state.loading && !this.state.list.length && (
            <div className='center'>
              <FaExclamationTriangle size={150} color='#ccc' />
              <div>Nenhum produto cadastrado até o momento!</div>
            </div>
          ) }
          { !this.state.loading && this.state.list.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome</th>
                  <th>Código barras</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                { this.state.list.map(item => (
                  <tr key={item.codigo}>
                    <td>{item.codigo}</td>
                    <td>{item.nome}</td>
                    <td>{item.codigoBarras}</td>
                    <td>R$ {serviceUtil.formatReal(item.preco)}</td>
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
