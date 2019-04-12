import React, { Component } from 'react'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { Redirect } from 'react-router-dom'

import HeaderProdutos from '../../components/HeaderProdutos'
import { Table, Input, Row, Col, Button } from 'reactstrap'
import Loading from '../../components/Loading'

import * as serviceProdutos from '../../services/serviceProdutos'
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

  edit = (id) => {
    this.setState({
      redirectEdit: true,
      id: id
    })
  }

  render () {
    return (
      <div className='content'>
        { this.state.redirectEdit && (<Redirect to={'/produtos/cadastro/' + this.state.id} />)}
        <HeaderProdutos />
        <div className='list-filter'>
          <Row className='box-filter'>
            <Col xs={1.5}>
              <Input type='select' value={this.state.filter} onChange={this.updateFild} id='filter'>
                <option value='nome'>Nome</option>
                <option value='descricao'>Descrição</option>
                <option value='id'>Código</option>
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
              <div>Nenhum produto cadastrado até o momento!</div>
            </div>
          ) }
          { !this.state.loading && this.state.list.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nome</th>
                  <th>Estoque</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                { this.state.list.map(item => (
                  <tr key={item.id} onClick={() => this.edit(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.nome}</td>
                    <td>{item.estoque}</td>
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
