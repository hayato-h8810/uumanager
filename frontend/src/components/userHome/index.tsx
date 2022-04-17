import { Route, useHistory, useLocation, Switch } from 'react-router-dom'
import styled from 'styled-components'
import IndexOfProfile from './profile/index'
import IndexOfListOfFolderAndUrl from './listOfFolderAndUrl/index'
import IndexOfNotificationDisplay from './notificationDisplay/index'
import IndexOfBrowsingHistoryDisplay from './browsingHistory/index'
import NavTabs from './NavTabs'
import PageNotFound from '../../views/pageNotFound'

export default function UserHomeIndex() {
  const history = useHistory()
  const location = useLocation()
  if (/^(\/userHome|\/userHome\/)$/.test(location.pathname)) {
    history.push('/userHome/listOfFolderAndUrl')
  }

  return (
    <>
      {/^(profile|listOfFolderAndUrl|calendar|browsingHistory)/.test(location.pathname.substr(10)) && <NavTabs />}
      <Container>
        <Switch>
          <Route path="/userHome/profile" component={IndexOfProfile} />
          <Route path="/userHome/listOfFolderAndUrl" component={IndexOfListOfFolderAndUrl} />
          <Route path="/userHome/calendar" component={IndexOfNotificationDisplay} />
          <Route path="/userHome/browsingHistory" component={IndexOfBrowsingHistoryDisplay} />
          <Route component={PageNotFound} />
        </Switch>
      </Container>
    </>
  )
}

const Container = styled.div`
  background: white;
  min-width: 1440px;
`
