import React, { Component } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import HeaderFinanceiro from '../../components/HeaderFinanceiro'
import Loading from '../../components/Loading'

import * as serviceFinanceiro from '../../services/serviceFinanceiro'
import * as serviceClientes from '../../services/serviceClientes'
import * as serviceFormasPagamento from '../../services/serviceFormasPagamento'

export default class FinanceiroCadastro extends Component {
  state = {
    clientes: [],
    formasPagamento: [],
    cliente: '',
    valor: 0,
    data_vencimento: new Date(),
    forma_pagamento: '',
    situacao: 'Em aberto',
    tipo: 'A pagar'
  }

  async componentWillMount () {
    try {
      this.setState({
        clientes: await serviceClientes.getAllWithoutLimit(),
        formasPagamento: await serviceFormasPagamento.getList()
      })
      if (this.props.match.params.id) {
        this.setState({ loading: true })
        const financeiro = await serviceFinanceiro.get(this.props.match.params.id)
        this.setState({ ...financeiro, loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      window.alert.error(error)
    }
  }

  updateField = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }

  updateFieldDate = (date) => {
    this.setState({ data_vencimento: date })
  }

  save = async () => {
    try {
      if (!this.state.cliente) return window.alert.error('Selecione um cliente!')
      if (!this.state.valor) return window.alert.error('Digite o valor da conta!')
      if (!this.state.data_vencimento) return window.alert.error('Digite a data de vencimento da conta!')
      if (!this.state.forma_pagamento) return window.alert.error('Selecione a forma de pagamento!')
      if (!this.state.tipo) return window.alert.error('Selecione o tipo da conta!')

      this.setState({ loadingSave: true })

      await serviceFinanceiro.save(this.state)
      this.setState({
        redirect: true
      })
      window.alert.success('Conta salva com sucesso!')
    } catch (error) {
      this.setState({ loadingSave: false })
      window.alert.error(error)
    }
  }

  render () {
    return (
      <div className='content'>
        <HeaderFinanceiro label='Cadastro de nova conta' />
        { this.state.redirect && (<Redirect to='/financeiro' />)}
        { this.state.loading && <Loading />}
        { !this.state.loading && (
          <Container>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Cliente:</Form.Label>
                  <Form.Control autoFocus as='select' value={this.state.cliente} onChange={this.updateField} id='cliente'>
                    <option value=''>Selecione um cliente</option>
                    { this.state.clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.fantasia}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Valor:</Form.Label>
                  <Form.Control type='number' onChange={this.updateField} id='valor' value={this.state.valor} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Data vencimento:</Form.Label>
                  <DatePicker dateFormat='dd/MM/yyyy' className='form-control' selected={this.state.data_vencimento} onChange={this.updateFieldDate} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Forma de pagamento:</Form.Label>
                  <Form.Control as='select' value={this.state.forma_pagamento} onChange={this.updateField} id='forma_pagamento'>
                    <option value=''>Selecione uma forma de pagamento</option>
                    { this.state.formasPagamento.map(pag => (
                      <option key={pag.id} value={pag.id}>{pag.nome}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Situacao:</Form.Label>
                  <Form.Control as='select' value={this.state.situacao} onChange={this.updateField} id='situacao'>
                    <option value='Em aberto'>Em aberto</option>
                    <option value='Pago'>Pago</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Tipo:</Form.Label>
                  <Form.Control as='select' defaultValue={this.state.tipo} onChange={this.updateField} id='tipo'>
                    <option value='A pagar'>A pagar</option>
                    <option value='A receber'>A receber</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Button disabled={this.state.loadingSave} onClick={this.save} variant='primary'>
                    { !this.state.loadingSave ? 'Salvar' : 'Salvando...'}
                  </Button>
                  <Link to='/financeiro'>
                    <Button variant='secundary'> Cancelar </Button>
                  </Link>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}
