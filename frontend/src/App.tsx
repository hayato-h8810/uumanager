import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/home'
import CreateUser from './components/createUser'
import Login from './components/login'
import UserHome from './components/userHome'
import PageNotFound from './components/pageNotFound'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/createUser" component={CreateUser} />
        <Route path="/login" component={Login} />
        <Route path="/:id" component={UserHome} />
        <Route component={PageNotFound} />
      </Switch>
    </Router>
  )
}

export default App
