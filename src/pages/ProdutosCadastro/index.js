import React, { Component } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'

import HeaderProdutos from '../../components/HeaderProdutos'
import Loading from '../../components/Loading'

import * as serviceProdutos from '../../services/serviceProdutos'

export default class ProdutosCadastro extends Component {
  state = {
    nome: '',
    descricao: '',
    preco: 0,
    estoque: 0,
    maximo_desconto: 0
  }

  async componentWillMount () {
    if (this.props.match.params.id) {
      try {
        this.setState({ loading: true })
        const product = await serviceProdutos.get(this.props.match.params.id)
        this.setState({ ...product, loading: false })
      } catch (error) {
        this.setState({ loading: false })
        window.alert.error(error)
      }
    }
  }

  updateField = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }

  save = async () => {
    try {
      if (!this.state.nome) return window.alert.error('Digite o nome do produto!')
      if (!this.state.preco) return window.alert.error('Digite o preço do produto!')
      this.setState({ loadingSave: true })

      await serviceProdutos.save(this.state)
      this.setState({
        redirect: true
      })
      window.alert.success('Produto salvo com sucesso!')
    } catch (error) {
      this.setState({ loadingSave: false })
      window.alert.error(error)
    }
  }

  render () {
    return (
      <div className='content'>
        <HeaderProdutos label='Cadastro de produto' />
        { this.state.redirect && (<Redirect to='/produtos' />)}
        { this.state.loading && <Loading />}
        { !this.state.loading && (
          <Container>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control autoFocus type='text' onChange={this.updateField} id='nome' value={this.state.nome} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Preço:</Form.Label>
                  <Form.Control type='number' onChange={this.updateField} id='preco' value={this.state.preco} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Estoque:</Form.Label>
                  <Form.Control type='number' onChange={this.updateField} id='estoque' value={this.state.estoque} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Máximo de desconto:</Form.Label>
                  <Form.Control type='number' onChange={this.updateField} id='maximo_desconto' value={this.state.maximo_desconto} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Descrição:</Form.Label>
                  <Form.Control as='textarea' rows='3' onChange={this.updateField} id='descricao' value={this.state.descricao} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Button disabled={this.state.loadingSave} onClick={this.save} variant='primary'>
                    { !this.state.loadingSave ? 'Salvar' : 'Salvando...'}
                  </Button>
                  <Link to='/produtos'>
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
