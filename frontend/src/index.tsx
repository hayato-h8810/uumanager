import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { createGlobalStyle } from 'styled-components'
import App from './App'
import reportWebVitals from './reportWebVitals'

const link = createHttpLink({
  uri: 'https://uumanager.com/graphql',
  credentials: 'include',
})

// const link = createHttpLink({
//   uri: 'http://localhost:8000/graphql',
//   credentials: 'include',
// })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
})

const GlobalStyle = createGlobalStyle`
  body{     
    background: #E9EEEF;     
    margin: 0 auto;  
    font-family: "Noto Sans JP";
`

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <GlobalStyle />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
