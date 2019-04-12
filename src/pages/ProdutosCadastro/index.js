import React, { Component } from 'react'
import { Input, Button, Container, Row, Col, Label, FormGroup } from 'reactstrap'
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
                <FormGroup>
                  <Label>Nome:</Label>
                  <Input autoFocus type='text' onChange={this.updateField} id='nome' value={this.state.nome} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Preço:</Label>
                  <Input type='number' onChange={this.updateField} id='preco' value={this.state.preco} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Estoque:</Label>
                  <Input type='number' onChange={this.updateField} id='estoque' value={this.state.estoque} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Máximo de desconto:</Label>
                  <Input type='number' onChange={this.updateField} id='maximo_desconto' value={this.state.maximo_desconto} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Descrição:</Label>
                  <Input as='textarea' rows='3' onChange={this.updateField} id='descricao' value={this.state.descricao} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Button className='mr-2' disabled={this.state.loadingSave} onClick={this.save} color='primary'>
                    { !this.state.loadingSave ? 'Salvar' : 'Salvando...'}
                  </Button>
                  <Link to='/produtos'>
                    <Button variant='secundary'> Cancelar </Button>
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
