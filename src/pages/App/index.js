import React, { Component } from 'react'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'

import Pedidos from '../Pedidos'
import Clientes from '../Clientes'
import Produtos from '../Produtos'
import ProdutosCadastro from '../ProdutosCadastro'
import Financeiro from '../Financeiro'

import Header from '../../components/Header'
import Loading from '../../components/Loading'

import * as serviceUsuario from '../../services/serviceUsuario'

class App extends Component {
  state = {
    menuSelected: '',
    loading: true,
    host: window.localStorage.getItem('database-host') || '',
    user: window.localStorage.getItem('database-user') || '',
    password: window.localStorage.getItem('database-password') || '',
    port: window.localStorage.getItem('database-port') || 3306,
    dbname: window.localStorage.getItem('database-dbname') || '',
    loginUser: '',
    loginPassword: ''
  }

  changeMenu = (menuSelected) => {
    this.setState({ menuSelected })
  }

  async componentWillMount () {
    try {
      const connect = await window.db.connect()
      if (connect.length) {
        this.setState({
          loading: false,
          showFormLogin: true
        })
      }
    } catch (error) {
      if (error !== window.db.messageDbNotFound) {
        window.alert.error(error)
      }
      this.setState({
        loading: false,
        showConfigurationDatabase: true
      })
    }
  }

  updateField = (event) => {
    this.setState({ [event.target.id]: event.target.value })
  }

  connectAndTestDb = async () => {
    if (!this.state.host) return window.alert.error('Digite o HOST de seu banco de dados!')
    if (!this.state.user) return window.alert.error('Digite o usuário de seu banco de dados!')
    if (!this.state.password) return window.alert.error('Digite a senha do seu banco de dados!')
    if (!this.state.port) return window.alert.error('Digite a porta do seu banco de dados!')
    if (!this.state.dbname) return window.alert.error('Digite o nome do seu banco de dados!')

    this.setState({ loadingSave: true })

    window.localStorage.setItem('database-host', this.state.host)
    window.localStorage.setItem('database-user', this.state.user)
    window.localStorage.setItem('database-password', this.state.password)
    window.localStorage.setItem('database-dbname', this.state.dbname)
    window.localStorage.setItem('database-port', this.state.port)

    try {
      const connect = await window.db.connect()
      console.log(connect)
    } catch (error) {
      this.setState({ loadingSave: false })
      window.alert.error(error)
    }
  }

  login = async () => {
    try {
      if (!this.state.loginUser) return window.alert.error('Entre com seu usuário!')
      if (!this.state.loginPassword) return window.alert.error('Entre com sua senha!')
      this.setState({ loadingLogin: true })

      const user = await serviceUsuario.login(this.state.loginUser, this.state.loginPassword)
      this.setState({
        userLogged: user,
        loadingLogin: false,
        showConfigurationDatabase: false,
        showFormLogin: false
      })
    } catch (error) {
      console.log(error)
      this.setState({ loadingLogin: false })
      window.alert.error(error)
    }
  }

  pressEnter = (event) => {
    if (event.key === 'Enter') this.login()
  }

  render () {
    return (
      <div>
        { this.state.loading && <Loading verticalAlign />}
        { !this.state.loading && this.state.showFormLogin && (
          <Container className='d-flex justify-content-center align-items-center container'>
            <Row className='paddinBigTop'>
              <Col>
                <Form.Group>
                  <h2>Faça o login</h2>
                  <p>Entre com seu usuário e senha para acessar o sistema!</p>

                  <Form.Label>Usuário:</Form.Label>
                  <Form.Control autoFocus type='text' onChange={this.updateField} id='loginUser' value={this.state.loginUser} />

                  <Form.Label>Senha:</Form.Label>
                  <Form.Control onKeyPress={this.pressEnter} type='password' onChange={this.updateField} id='loginPassword' value={this.state.loginPassword} />

                </Form.Group>
                <Form.Group>
                  <Button disabled={this.state.loadingLogin} onClick={this.login} variant='primary' type='submit'>
                    { !this.state.loadingLogin ? 'Entrar' : 'Entrando...'}
                  </Button>
                </Form.Group>
              </Col>

            </Row>
          </Container>
        )}
        { !this.state.loading && this.state.showConfigurationDatabase && (
          <Container className='d-flex justify-content-center align-items-center container'>
            <Row className='paddinBigTop'>

              <Col>
                <Form.Group>
                  <h2>Configuração do banco de dados</h2>
                  <p>Não foi encontrado uma conexão com banco de dados, sendo assim configure sua conexão no formulário abaixo!</p>

                  <Form.Label>Banco de dados:</Form.Label>
                  <Form.Control as='select'>
                    <option value='mysql'>MySQL</option>
                  </Form.Control>

                  <Form.Label>Host:</Form.Label>
                  <Form.Control autoFocus type='text' placeholder='Exemplo: 192.168.1.1' onChange={this.updateField} id='host' value={this.state.host} />

                  <Form.Label>Usuário:</Form.Label>
                  <Form.Control type='text' placeholder='Exemplo: root' onChange={this.updateField} id='user' value={this.state.user} />

                  <Form.Label>Senha:</Form.Label>
                  <Form.Control type='password' placeholder='Exemplo: root' onChange={this.updateField} id='password' value={this.state.password} />

                  <Form.Label>Porta:</Form.Label>
                  <Form.Control type='number' value={this.state.port} onChange={this.updateField} id='port' />

                  <Form.Label>Nome do banco de dados:</Form.Label>
                  <Form.Control type='text' placeholder='Exemplo: opengestao' value={this.state.dbname} onChange={this.updateField} id='dbname' />

                </Form.Group>
                <Form.Group>
                  <Button disabled={this.state.loadingSave} onClick={this.connectAndTestDb} variant='primary' type='submit'>
                    { !this.state.loadingSave ? 'Salvar e testar' : 'Salvando...'}
                  </Button>
                </Form.Group>
              </Col>

            </Row>
          </Container>
        )}
        { !this.state.loading && this.state.userLogged && (
          <HashRouter>
            <div>
              <Header changeMenu={this.changeMenu} />
              <Route exact path='/' render={() => <Redirect to='/pedidos' />} />
              <Route path='/pedidos' exact component={Pedidos} />
              <Route path='/clientes' exact component={Clientes} />
              <Route path='/produtos' exact component={Produtos} />
              <Route path='/produtos/cadastro' component={ProdutosCadastro} />
              <Route path='/produtos/cadastro/:id' component={ProdutosCadastro} />
              <Route path='/financeiro' exact component={Financeiro} />
            </div>
          </HashRouter>
        )}
      </div>

    )
  }
}

export default App
