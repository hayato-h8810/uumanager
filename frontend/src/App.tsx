import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LandingPage from './views/landingPage'
import CreateUser from './views/createUser'
import Login from './views/login'
import UserHome from './views/userHome'
import PageNotFound from './views/pageNotFound'
import Header from './components/header'
import Footer from './components/footer'

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={LandingPage} />
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
