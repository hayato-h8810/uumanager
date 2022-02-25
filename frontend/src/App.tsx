import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/home'
import CreateUser from './components/createUser'
import Login from './components/login'
import UserHome from './components/userHome'
import PageNotFound from './components/pageNotFound'
import Header from './components/header'
import Footer from './components/footer'

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/createUser" component={CreateUser} />
        <Route path="/login" component={Login} />
        <Route path="/:id" component={UserHome} />
        <Route component={PageNotFound} />
      </Switch>
      <Footer />
    </Router>
  )
}

export default App
