import { useHistory } from 'react-router-dom'
import { useCurrentUserQuery } from '../api/graphql'

export default function UserHome() {
  const history = useHistory()
  const { data: { currentUser = null } = {}, loading } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (!currentUser) history.push('/login')
    },
  })

  if (loading) return <h1>ロード中</h1>

  return <h1>user home</h1>
}
