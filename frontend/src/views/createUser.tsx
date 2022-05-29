import styled from 'styled-components'
import Index from '../components/createUser/index'
import Footer from '../components/footer'

export default function CreateUserContainer() {
  return (
    <>
      <Container>
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
  .MuiLoadingButton-root {
    position: absolute;
    top: 87%;
    left: 45%;
    background: #20a1ff;
  }
`
