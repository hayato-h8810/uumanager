import { Route, useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import IndexOfProfile from './profile/index'
import IndexOfListOfFolderAndUrl from './listOfFolderAndUrl/index'
import IndexOfNotificationDisplay from './notificationDisplay/index'
import IndexOfBrowsingHistoryDisplay from './browsingHistory/index'
import NavTabs from './NavTabs'

export default function UserHomeIndex() {
  const history = useHistory()
  const location = useLocation()
  if (/^(\/userHome|\/userHome\/)$/.test(location.pathname)) {
    history.push('/userHome/ListOfFolderAndUrl')
  }

  return (
    <>
      <NavTabs />
      <Container>
        <Route path="/userHome/profile" component={IndexOfProfile} />
        <Route path="/userHome/ListOfFolderAndUrl" component={IndexOfListOfFolderAndUrl} />
        <Route path="/userHome/calendar" component={IndexOfNotificationDisplay} />
        <Route path="/userHome/browsingHistory" component={IndexOfBrowsingHistoryDisplay} />
      </Container>
    </>
  )
}

const Container = styled.div`
  background: white;
  min-width: 1440px;
`
