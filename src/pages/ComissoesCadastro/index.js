import React, { Component } from 'react'
import { Input, Button, Container, Row, Col, Label, FormGroup } from 'reactstrap'
import { Link, Redirect } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'

import HeaderComissoes from '../../components/HeaderComissoes'
import Loading from '../../components/Loading'

import * as servicePedidos from '../../services/servicePedidos'
import * as serviceClientes from '../../services/serviceClientes'
import * as serviceUsuario from '../../services/serviceUsuario'
import * as serviceComissoes from '../../services/serviceComissoes'
import moment from 'moment'

export default class ComissoesCadastro extends Component {
  state = {
    clientes: [],
    usuarios: [],
    pedidos: [],
    valor_comissao: 0,
    situacao: 'Em aberto'
  }

  async componentWillMount () {
    try {
      this.setState({
        clientes: await serviceClientes.getAllWithoutLimit(),
        usuarios: await serviceUsuario.getAllWithoutLimit(),
        pedidos: await servicePedidos.getAllWithoutLimit()
      })
      if (this.props.match.params.id) {
        this.setState({ loading: true })
        const comissao = await serviceComissoes.get(this.props.match.params.id)
        comissao.data_pedido = moment(comissao.data_pedido, 'YYYY-MM-DD').toDate()

        this.setState({ ...comissao, loading: false })
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
    this.setState({ data: date })
  }

  save = async () => {
    try {
      if (!this.state.pedido) return window.alert.error('Selecione um pedido!')
      if (!this.state.valor_comissao) return window.alert.error('Informe o valor da comissão!')

      this.setState({ loadingSave: true })

      await serviceComissoes.save(this.state)
      this.setState({
        redirect: true
      })
      window.alert.success('Comissão salvo com sucesso!')
    } catch (error) {
      this.setState({ loadingSave: false })
      window.alert.error(error)
    }
  }

  render () {
    return (
      <div className='content'>

        <HeaderComissoes label='Cadastro de nova comissão' />
        { this.state.redirect && (<Redirect to='/comissoes' />)}
        { this.state.loading && <Loading />}
        { !this.state.loading && (
          <Container>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Pedido:</Label>
                  <Input autoFocus type='select' value={this.state.pedido} onChange={this.updateField} id='pedido'>
                    <option value=''>Selecione um pedido</option>
                    { this.state.pedidos.map(pedido => (
                      <option key={pedido.id} value={pedido.id}>{pedido.label}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Valor da comissão:</Label>
                  <Input type='number' value={this.state.valor_comissao} onChange={this.updateField} id='valor_comissao' />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Situação:</Label>
                  <Input type='select' onChange={this.updateField} id='situacao' value={this.state.situacao}>
                    <option value='Em aberto'>Em aberto</option>
                    <option value='Pago'>Pago</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Button className='mr-2' disabled={this.state.loadingSave} onClick={this.save} color='primary'>
                    { !this.state.loadingSave ? 'Salvar' : 'Salvando...'}
                  </Button>
                  <Link to='/comissoes'>
                    <Button color='secundary'> Cancelar </Button>
                  </Link>
                </FormGroup>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}
