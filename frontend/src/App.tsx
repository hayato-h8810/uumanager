import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './components/home'
import CreateUser from './components/create_user'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/createUser" component={CreateUser} />
      </Switch>
    </Router>
  )
}

export default App
