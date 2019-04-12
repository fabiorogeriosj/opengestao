import React, { Component } from 'react'
import { Input, Button, Container, Row, Col, Modal, Table, Label, FormGroup, ModalHeader, ModalBody } from 'reactstrap'
import { Link, Redirect } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import pt from 'date-fns/locale/pt'
import { FaCalendarAlt } from 'react-icons/fa'

import HeaderPedidos from '../../components/HeaderPedidos'
import Loading from '../../components/Loading'
import serviceUtil from '../../services/serviceUtil'

import * as servicePedidos from '../../services/servicePedidos'
import * as serviceClientes from '../../services/serviceClientes'
import * as serviceFormasPagamento from '../../services/serviceFormasPagamento'
import ProdutosSelect from '../ProdutosSelect'
import moment from 'moment'

export default class PedidosCadastro extends Component {
  state = {
    clientes: [],
    formasPagamento: [],
    itens: [],
    usuario: window.userLogged && window.userLogged.id ? window.userLogged.id : 0,
    cliente: '',
    quantidade_itens: 0,
    total_pedido: 0,
    valor_desconto: 0,
    data: new Date(),
    pagamento: '',
    status: 'Novo',
    observacao: ''
  }

  async componentWillMount () {
    try {
      this.setState({
        clientes: await serviceClientes.getAllWithoutLimit(),
        formasPagamento: await serviceFormasPagamento.getList()
      })
      if (this.props.match.params.id) {
        this.setState({ loading: true })
        const pedido = await servicePedidos.get(this.props.match.params.id)
        pedido.data = moment(pedido.data, 'YYYY-MM-DD').toDate()

        const itens = await servicePedidos.getItens(this.props.match.params.id)
        var quantidadeItens = 0
        itens.map(item => (quantidadeItens += Number(item.quantidade)))
        this.setState({
          ...pedido,
          itens: itens,
          quantidade_itens: quantidadeItens,
          loading: false })
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
      if (!this.state.cliente) return window.alert.error('Selecione um cliente!')
      if (!this.state.pagamento) return window.alert.error('Selecione a forma de pagamento!')
      if (!this.state.data) return window.alert.error('Digite a data do pedido!')
      if (!this.state.itens.length) return window.alert.error('Adicione pelo menos um item no seu pedido!')

      this.setState({ loadingSave: true })

      await servicePedidos.save(this.state)
      this.setState({
        redirect: true
      })
      window.alert.success('Pedido salvo com sucesso!')
    } catch (error) {
      this.setState({ loadingSave: false })
      window.alert.error(error)
    }
  }

  addProduto = () => {
    this.setState({
      showAddProduto: true
    })
  }

  hideProduto = () => {
    this.setState({ showAddProduto: false })
  }

  selectProduto = (produto) => {
    const itens = this.state.itens
    itens.push({
      produto: produto.id,
      produto_nome: produto.nome,
      quantidade: 1,
      observacao: '',
      valor_unitario: produto.preco,
      valor_desconto: 0,
      valor_total: produto.preco * 1
    })
    this.setState({
      itens: itens,
      total_pedido: this.getTotalPedido(),
      quantidade_itens: this.getQuantidadeItens(),
      showAddProduto: false
    })
  }

  getTotalPedido = () => {
    var totalPedido = 0
    this.state.itens.map(item => (totalPedido += item.valor_total))
    return totalPedido - this.state.valor_desconto
  }

  getQuantidadeItens = () => {
    var quantidadeItens = 0
    this.state.itens.map(item => (quantidadeItens += Number(item.quantidade)))
    return quantidadeItens
  }

  removeProduto = (event) => {
    const index = event.target.getAttribute('index')
    const itens = this.state.itens
    delete itens[index]
    itens.splice(index, 1)
    this.setState({
      itens,
      quantidade_itens: this.getQuantidadeItens(),
      total_pedido: this.getTotalPedido()
    })
  }

  updateQuantidade = (event, item) => {
    const quantidade = event.target.value
    item.quantidade = quantidade
    item.valor_total = item.valor_unitario * item.quantidade - item.valor_desconto
    this.setState({
      itens: this.state.itens,
      quantidade_itens: this.getQuantidadeItens(),
      total_pedido: this.getTotalPedido()
    })
  }

  updateValorDesconto = (event, item) => {
    const valorDesconto = event.target.value
    item.valor_desconto = valorDesconto
    item.valor_total = item.valor_unitario * item.quantidade - item.valor_desconto
    this.setState({
      itens: this.state.itens,
      quantidade_itens: this.getQuantidadeItens(),
      total_pedido: this.getTotalPedido()
    })
  }

  updateValorDescontoPedido = (event) => {
    var desconto = event.target.value
    this.setState({
      valor_desconto: desconto,
      total_pedido: this.getTotalPedido() - desconto
    })
  }

  render () {
    return (
      <div className='content'>
        <Modal size='lg' isOpen={this.state.showAddProduto} autoFocus onClosed={this.hideProduto}>
          <ModalHeader closeButton>
            Selecione um produto
          </ModalHeader>
          <ModalBody>
            <ProdutosSelect select={this.selectProduto} />
          </ModalBody>
        </Modal>

        <HeaderPedidos label='Cadastro de novo pedido' />
        { this.state.redirect && (<Redirect to='/pedidos' />)}
        { this.state.loading && <Loading />}
        { !this.state.loading && (
          <Container>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Cliente:</Label>
                  <Input autoFocus type='select' value={this.state.cliente} onChange={this.updateField} id='cliente'>
                    <option value=''>Selecione um cliente</option>
                    { this.state.clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.fantasia}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Data do pedido:</Label>
                  <DatePicker locale={pt} dateFormat='dd/MM/yyyy' className='form-control' selected={this.state.data} onChange={this.updateFieldDate} id='data' />
                  <label className='inner-input' htmlFor='data'>
                    <FaCalendarAlt color='#ccc' />
                  </label>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Forma de pagamento:</Label>
                  <Input type='select' value={this.state.pagamento} onChange={this.updateField} id='pagamento'>
                    <option value=''>Selecione uma forma de pagamento</option>
                    { this.state.formasPagamento.map(pag => (
                      <option key={pag.id} value={pag.id}>{pag.nome}</option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Status:</Label>
                  <Input type='select' value={this.state.status} onChange={this.updateField} id='status'>
                    <option value='Novo'>Novo</option>
                    <option value='Faturado'>Faturado</option>
                    <option value='Cancelado'>Cancelado</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Observações do pedido:</Label>
                  <Input type='text' value={this.state.observacao} onChange={this.updateField} id='observacao' />
                </FormGroup>
              </Col>
            </Row>

            <div className='pedido-itens'>
              { !this.state.itens.length && (
                <div className='box-itens center padding-big'>
                  <Row>
                    <Col>
                        Nenhum produto adicionado no pedido
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button color='outline-primary' onClick={this.addProduto}>Adicionar produto</Button>
                    </Col>
                  </Row>
                </div>
              )}
              { this.state.itens.length && (
                <div>
                  <Row>
                    <Col className='p-0'>
                      <Table striped bordered>
                        <thead>
                          <tr>
                            <th>Produto</th>
                            <th>Observação</th>
                            <th>Preço</th>
                            <th>Quantidade</th>
                            <th>Valor Desconto</th>
                            <th>Total</th>
                            <th />
                          </tr>
                        </thead>
                        <tbody>
                          { this.state.itens.map((item, index) => (
                            <tr key={item.produto}>
                              <td className='align-middle'>{item.produto_nome}</td>
                              <td className='align-middle'>
                                <Input type='text' defaultValue={item.observacao} onChange={(event) => (item.observacao = event.target.value)} />
                              </td>
                              <td className='align-middle'>
                                R$ {serviceUtil.formatReal(item.valor_unitario)}
                              </td>
                              <td className='align-middle input-edit-number'>
                                <Input type='number' defaultValue={item.quantidade} onChange={(event) => this.updateQuantidade(event, item)} />
                              </td>
                              <td className='align-middle input-edit-value'>
                                <Input type='number' defaultValue={item.valor_desconto} onChange={(event) => this.updateValorDesconto(event, item)} />
                              </td>
                              <td className='align-middle'>R$ {serviceUtil.formatReal(item.valor_total)}</td>
                              <td align='center' className='align-middle'>
                                <Button onClick={this.removeProduto} index={index} size='sm' color='outline-danger'>Excluir</Button>
                              </td>
                            </tr>
                          ))}
                          <tr className='table-secondary'>
                            <td className='align-middle' colSpan={3}>Totais</td>
                            <td className='align-middle input-edit-number'>{this.state.quantidade_itens}</td>
                            <td className='align-middle input-edit-value'>
                              <Input type='number' defaultValue={this.state.valor_desconto} onChange={this.updateValorDescontoPedido} />
                            </td>
                            <td className='align-middle'>R$ {serviceUtil.formatReal(this.state.total_pedido)}</td>
                            <td align='center' className='align-middle' />
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row className='center'>
                    <Col>
                      <Button color='outline-primary' onClick={this.addProduto}>Adicionar produto</Button>
                    </Col>
                  </Row>
                </div>
              )}
            </div>

            <Row>
              <Col>
                <FormGroup>
                  <Button className='mr-2' disabled={this.state.loadingSave} onClick={this.save} color='primary'>
                    { !this.state.loadingSave ? 'Salvar' : 'Salvando...'}
                  </Button>
                  <Link to='/pedidos'>
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
