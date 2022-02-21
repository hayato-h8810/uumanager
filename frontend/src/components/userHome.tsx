import { useHistory } from 'react-router-dom'
import { useCurrentUserQuery, useLogoutLazyQuery } from '../api/graphql'

export default function UserHome() {
  const history = useHistory()
  const [logoutQuery] = useLogoutLazyQuery({
    onCompleted: (data) => {
      console.log(data?.logout?.id)
      if (!data?.logout?.id) history.push('/')
    },
  })
  const { data: { currentUser = null } = {}, loading } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      console.log(currentUser?.id)
      if (!currentUser) history.push('/login')
    },
  })

  if (loading) return <h1>ロード中</h1>

  return (
    <>
      <h1>user home</h1>
      <button type="button" onClick={() => logoutQuery()} data-cy="logoutButton">
        ログアウト
      </button>
    </>
  )
}
