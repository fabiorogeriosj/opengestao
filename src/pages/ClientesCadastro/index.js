import React, { Component } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'

import HeaderClientes from '../../components/HeaderClientes'
import Loading from '../../components/Loading'

import * as serviceClientes from '../../services/serviceClientes'

export default class ClientesCadastro extends Component {
  state = {
    razao: '',
    fantasia: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    cidade: '',
    uf: '',
    situacao: 'Ativo'
  }

  async componentWillMount () {
    if (this.props.match.params.id) {
      try {
        this.setState({ loading: true })
        const cliente = await serviceClientes.get(this.props.match.params.id)
        this.setState({ ...cliente, loading: false })
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
      if (!this.state.fantasia) return window.alert.error('Digite o nome/fantasia do cliente!')
      if (!this.state.situacao) return window.alert.error('Situação é obrigatório!')
      this.setState({ loadingSave: true })

      await serviceClientes.save(this.state)
      this.setState({
        redirect: true
      })
      window.alert.success('Cliente salvo com sucesso!')
    } catch (error) {
      this.setState({ loadingSave: false })
      window.alert.error(error)
    }
  }

  render () {
    return (
      <div className='content'>
        <HeaderClientes label='Cadastro de cliente' />
        { this.state.redirect && (<Redirect to='/clientes' />)}
        { this.state.loading && <Loading />}
        { !this.state.loading && (
          <Container>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Nome/Fantasia:</Form.Label>
                  <Form.Control autoFocus type='text' onChange={this.updateField} id='fantasia' value={this.state.fantasia} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Apelido/Razão Social:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='razao' value={this.state.razao} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>CPF/CNPJ:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='cnpj' value={this.state.cnpj} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group>
                  <Form.Label>Endereço:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='endereco' value={this.state.endereco} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Cidade:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='cidade' value={this.state.cidade} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>UF:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='uf' value={this.state.uf} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>E-mail:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='email' value={this.state.email} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Telefone:</Form.Label>
                  <Form.Control type='text' onChange={this.updateField} id='telefone' value={this.state.telefone} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Situação:</Form.Label>
                  <Form.Control as='select' onChange={this.updateField} id='situacao' value={this.state.situacao}>
                    <option value='Ativo'>Ativo</option>
                    <option value='Inativo'>Inativo</option>
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
                  <Link to='/clientes'>
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
