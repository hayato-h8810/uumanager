import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useCurrentUserQuery } from '../api/graphql'

export default function Header() {
  const history = useHistory()
  const location = useLocation()
  const { data: { currentUser = null } = {} } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
  })

  if (currentUser && location.pathname !== `/${currentUser.id}`) {
    return (
      <HeaderContainer>
        <button
          type="button"
          onClick={() => {
            history.push(`/${currentUser.id}`)
          }}
          data-cy="moveToUserHomeButton"
        >
          userHomeへ移動
        </button>
      </HeaderContainer>
    )
  }

  return <HeaderContainer>header</HeaderContainer>
}

const HeaderContainer = styled.div`
  background: #344460;
  width: 100%;
  height: 75px;
`
