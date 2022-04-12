import styled from 'styled-components'
import Index from '../components/createUser/index'

export default function CreateUserContainer() {
  return (
    <Container>
      <h1>ユーザー新規作成</h1>
      <Index />
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
    left: 45%;
    background: #20a1ff;
  }
`
