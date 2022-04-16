import styled from 'styled-components'
import UserDescription from './userDescription'
import LoginHistory from './loginHistory'
import RecentBrowsingHistory from './recentBrowsingHistory'

export default function Index() {
  return (
    <Container>
      <UserDescription />
      <LoginHistory />
      <RecentBrowsingHistory />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 200px 404px;
  grid-template-columns: 920px 520px;
  grid-template-areas:
    'userDiscription recentBrowsingHistory'
    'loginHistory    recentBrowsingHistory';
`
