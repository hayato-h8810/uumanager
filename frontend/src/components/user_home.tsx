import { useHistory } from 'react-router-dom'
import { useCurrentUserQuery, useLogoutLazyQuery } from '../api/graphql'

export default function UserHome() {
  const history = useHistory()
  const [logoutquery] = useLogoutLazyQuery({
    onCompleted: (data) => {
      // eslint-disable-next-line no-console
      console.log(data?.logout?.id)
      if (!data?.logout?.id) history.push('/')
    },
  })
  const { data: { currentUser = null } = {}, loading } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      // eslint-disable-next-line no-console
      console.log(currentUser?.id)
      if (!currentUser) history.push('/login')
    },
  })

  if (loading) return <h1>ロード中</h1>

  return (
    <>
      <h1>user home</h1>
      <button type="button" onClick={() => logoutquery()}>
        ログアウト
      </button>
    </>
  )
}
