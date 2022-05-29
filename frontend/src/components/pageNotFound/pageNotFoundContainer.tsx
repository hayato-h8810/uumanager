import styled from 'styled-components'

export default function PageNotFoundContainer() {
  return (
    <Container>
      <h1>404error</h1>
      <p>page not found</p>
    </Container>
  )
}

const Container = styled.div`
  background: white;
  text-align: center;
  height: 659px;
  h1 {
    display: inline-block;
    margin-top: 270px;
  }
`
