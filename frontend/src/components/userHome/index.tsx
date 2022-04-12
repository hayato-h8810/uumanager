import { Link, Route, useHistory, useLocation } from 'react-router-dom'
import IndexOfProfile from './profile/index'
import IndexOfListOfFolderAndUrl from './listOfFolderAndUrl/index'
import IndexOfNotificationDisplay from './notificationDisplay/index'
import IndexOfBrowsingHistoryDisplay from './browsingHistory/index'

export default function UserHomeIndex() {
  const history = useHistory()
  const location = useLocation()
  if (location.pathname === '/userHome') {
    history.push('/userHome/ListOfFolderAndUrl')
  }

  return (
    <>
      <div>user home index</div>
      <Link to="/userHome/profile">profile</Link>
      <br />
      <Link to="/userHome/ListOfFolderAndUrl">url list</Link>
      <br />
      <Link to="/userHome/calendar">calendar</Link>
      <br />
      <Link to="/userHome/browsingHistory">browsing history</Link>
      <Route path="/userHome/profile" component={IndexOfProfile} />
      <Route path="/userHome/ListOfFolderAndUrl" component={IndexOfListOfFolderAndUrl} />
      <Route path="/userHome/calendar" component={IndexOfNotificationDisplay} />
      <Route path="/userHome/browsingHistory" component={IndexOfBrowsingHistoryDisplay} />
    </>
  )
}
