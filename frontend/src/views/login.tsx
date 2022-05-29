import styled from 'styled-components'
import Footer from '../components/footer'
import Index from '../components/login/index'

export default function LoginContainer() {
  return (
    <>
      <Container>
        <h1>login</h1>
        <Index />
      </Container>
      <Footer />
    </>
  )
}

const Container = styled.div`
  position: relative;
  height: 544px;
  margin-top: 60px;
  margin-bottom: 55px;
  width: 676px;
  background: #fefefe;
  margin-left: auto;
  margin-right: auto;
  > h1 {
    padding-top: 70px;
    font-size: 25px;
    text-align: center;
    margin-bottom: 0;
  }
  .MuiLoadingButton-root {
    position: absolute;
    top: 87%;
    left: 42%;
    background: #20a1ff;
  }
`
