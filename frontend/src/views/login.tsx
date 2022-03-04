import styled from 'styled-components'
import Icons from '../components/icons'
import Form from '../components/login/Form'

export default function LoginContainer() {
  return (
    <Container>
      <h1>login</h1>
      <Icons/>
      <Form/>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  height: 544px;
  margin-top: 60px;
  width: 676px;
  background: #fefefe;
  margin-left: auto;
  margin-right: auto;
  > h1 {
    padding-top: 70px;
    font-size: 30px;
    text-align: center;
  }
  .MuiLoadingButton-root {
    position: absolute;
    top: 87%;
    left: 42%;
    background: #20a1ff;
  }
`
