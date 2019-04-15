import React, { Component } from 'react'
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa'
import { Redirect } from 'react-router-dom'

import HeaderComissoes from '../../components/HeaderComissoes'
import { Table, Input, Row, Col, Button, Alert } from 'reactstrap'
import Loading from '../../components/Loading'

import * as serviceComissoes from '../../services/serviceComissoes'
import serviceUtil from '../../services/serviceUtil'

export default class Comissoes extends Component {
  state = {
    list: [],
    loading: true,
    filter: 'usuario.nome',
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
        list: await serviceComissoes.getList({ search: this.state.search, filter: this.state.filter })
      })
    } catch (error) {
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
        { this.state.redirectEdit && (<Redirect to={'/comissoes/cadastro/' + this.state.id} />)}
        <HeaderComissoes />
        <div className='list-filter'>
          <Row className='box-filter'>
            <Col xs={1.5}>
              <Input type='select' value={this.state.filter} onChange={this.updateFild} id='filter'>
                <option value='usuario.nome'>Usuário</option>
                <option value='clientes.nome'>Cliente</option>
                <option value='id_pedido'>ID do pedido</option>
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
              <div>Nenhuma comissão cadastrada até o momento!</div>
            </div>
          ) }
          { !this.state.loading && this.state.list.length && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Usuário</th>
                  <th>Cliente</th>
                  <th>Pedido</th>
                  <th>Data pedido</th>
                  <th>Valor comissão</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                { this.state.list.map(item => (
                  <tr key={item.id} onClick={() => this.edit(item.id)}>
                    <td>{item.id}</td>
                    <td>{item.usuario}</td>
                    <td>{item.cliente}</td>
                    <td>{item.pedido}</td>
                    <td>{item.data_pedido}</td>
                    <td>R$ {serviceUtil.formatReal(item.valor_comissao)}</td>
                    <td>
                      { item.situacao === 'Pago' ? <Alert color='success'>Pago</Alert> : item.situacao }
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
