import styled from 'styled-components'
import BatchTransfer from './batchTransfer'
import EditList from './editList'

export default function Index() {
  return (
    <Container>
      <EditList />
      <BatchTransfer />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 714px;
  grid-template-columns: 500px 940px;
  grid-template-areas: 'editList batchTransfer';
`
