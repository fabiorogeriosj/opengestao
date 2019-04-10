import React, { Component } from 'react'

import { Container, Form, Row, Col, Button } from 'react-bootstrap'
import Loading from '../../components/Loading'

import * as serviceConfiguracoes from '../../services/serviceConfiguracoes'

export default class Configuracoes extends Component {
  state = {
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
    const configuracoes = await serviceConfiguracoes.get()
    console.log(configuracoes)
    this.setState({ ...configuracoes, loading: false })
  }

  render () {
    return (
      <div>
        <div className='sub-header'>
          <div className='box-sub-header'>
            <p>Configurações do sistema</p>
          </div>
        </div>
        { this.state.loading && <Loading />}
        { !this.state.loading && (
          <Container>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Utiliza módulo de Comissões?</Form.Label>
                  <Form.Control as='select' onChange={this.updateField} id='enableComissoes' value={this.state.enableComissoes}>
                    <option value='1'>Sim</option>
                    <option value='0'>Não</option>
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
                </Form.Group>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}
