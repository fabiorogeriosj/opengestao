import React, { Component } from 'react'
import { Input, Button, Container, Row, Col, Label, FormGroup } from 'reactstrap'
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
                <FormGroup>
                  <Label>Nome/Fantasia:</Label>
                  <Input autoFocus type='text' onChange={this.updateField} id='fantasia' value={this.state.fantasia} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Apelido/Razão Social:</Label>
                  <Input type='text' onChange={this.updateField} id='razao' value={this.state.razao} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>CPF/CNPJ:</Label>
                  <Input type='text' onChange={this.updateField} id='cnpj' value={this.state.cnpj} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label>Endereço:</Label>
                  <Input type='text' onChange={this.updateField} id='endereco' value={this.state.endereco} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Cidade:</Label>
                  <Input type='text' onChange={this.updateField} id='cidade' value={this.state.cidade} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>UF:</Label>
                  <Input type='text' onChange={this.updateField} id='uf' value={this.state.uf} />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>E-mail:</Label>
                  <Input type='text' onChange={this.updateField} id='email' value={this.state.email} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Telefone:</Label>
                  <Input type='text' onChange={this.updateField} id='telefone' value={this.state.telefone} />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Situação:</Label>
                  <Input type='select' onChange={this.updateField} id='situacao' value={this.state.situacao}>
                    <option value='Ativo'>Ativo</option>
                    <option value='Inativo'>Inativo</option>
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
                  <Link to='/clientes'>
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
