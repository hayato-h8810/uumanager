import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useCurrentUserQuery } from '../api/graphql'
import UserSettingBalloon from './userSettingBalloon'
import Notification from './notification'

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const history = useHistory()
  const location = useLocation()
  const { data: { currentUser = null } = {}, refetch } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
  })

  if (currentUser) {
    return (
      <HeaderContainer>
        <Notification />
        <UserSettingButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget)
          }}
          role="button"
          tabIndex={0}
        >
          ユーザー設定
        </UserSettingButton>
        {anchorEl && (
          <UserSettingBalloon
            props={{
              anchorEl,
              setAnchorEl,
              currentUser,
              refetch,
            }}
          />
        )}
        {!location.pathname.toLowerCase().startsWith('/userhome') && (
          <button
            type="button"
            onClick={() => {
              history.push('/userHome')
            }}
            data-cy="moveToUserHomeButton"
          >
            userHomeへ移動
          </button>
        )}
      </HeaderContainer>
    )
  }

  return <HeaderContainer>header</HeaderContainer>
}

const HeaderContainer = styled.div`
  background: #344460;
  width: 100%;
  height: 75px;
  min-width: 1440px;
`

const UserSettingButton = styled.div`
  color: white;
  display: inline-block;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 100px;
  &:hover {
    color: #c8c8c8;
  }
`
