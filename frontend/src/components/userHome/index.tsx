import { Route, useHistory, useLocation, Switch } from 'react-router-dom'
import styled from 'styled-components'
import { format } from 'date-fns'
import IndexOfProfile from './profile/index'
import IndexOfListOfFolderAndUrl from './listOfFolderAndUrl/index'
import IndexOfNotificationDisplay from './notificationDisplay/index'
import IndexOfBrowsingHistoryDisplay from './browsingHistory/index'
import UrlShow from './urlShow/index'
import NavTabs from './NavTabs'
import EditFolder from './editFolder/index'
import { useAddLoginHistoryMutation, useCurrentUserQuery } from '../../api/graphql'
import PageNotFound from '../../views/pageNotFound'

export default function UserHomeIndex() {
  const history = useHistory()
  const location = useLocation()
  if (/^(\/userHome|\/userHome\/)$/i.test(location.pathname)) {
    history.push('/userHome/listOfFolderAndUrl')
  }
  const { data: { currentUser = null } = {}, loading } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (!currentUser) {
        history.push('/login')
      } else {
        addLoginHistoryMutation({ variables: { date: format(new Date(), 'yyyy-MM-dd') } })
      }
    },
  })
  const [addLoginHistoryMutation] = useAddLoginHistoryMutation()

  if (loading) return <h1>ロード中</h1>

  return (
    <>
      {/^(profile|listOfFolderAndUrl|calendar|browsingHistory)/i.test(location.pathname.substr(10)) && <NavTabs />}
      <Container>
        <Switch>
          <Route path="/userHome/profile" component={IndexOfProfile} />
          <Route path="/userHome/listOfFolderAndUrl" component={IndexOfListOfFolderAndUrl} />
          <Route path="/userHome/calendar" component={IndexOfNotificationDisplay} />
          <Route path="/userHome/browsingHistory" component={IndexOfBrowsingHistoryDisplay} />
          <Route path="/userHome/urlShow/:id" component={UrlShow} />
          <Route path="/userHome/editFolder" component={EditFolder} />
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
