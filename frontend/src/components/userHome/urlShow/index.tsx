import styled from 'styled-components'
import Navigation from './navigation'
import UrlDescription from './urlDescription'
import BrowsingHistories from './browsingHistories'

export default function Index() {
  return (
    <Container>
      <Navigation />
      <UrlDescription />
      <BrowsingHistories />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 250px 820px 370px;
  grid-template-areas: 'navigation urlDescription browsingHistory';
`
