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

  return (
    <HeaderContainer>
      <Title onClick={() => history.push('/')}>URL管理アプリ</Title>
      {currentUser ? (
        <>
          <Notification />
          {!location.pathname.toLowerCase().startsWith('/userhome') && (
            <UserHomeButton onClick={() => history.push('/userHome')}>一覧へ</UserHomeButton>
          )}
          <UserSettingButton
            onClick={(e) => {
              setAnchorEl(e.currentTarget)
            }}
            className={location.pathname.toLowerCase().startsWith('/userhome') ? 'header-item-user-home' : ''}
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
        </>
      ) : (
        <>
          <LoginButton onClick={() => history.push('/login')}>ログイン</LoginButton>
          <CreateUserButton onClick={() => history.push('/createUser')}>ユーザー新規作成</CreateUserButton>
        </>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.div`
  background: #2c2c2c;
  width: 100%;
  height: 75px;
  min-width: 1440px;
`
const Title = styled.div`
  display: inline-block;
  color: white;
  font-size: 20px;
  margin-left: 140px;
  cursor: pointer;
  &:hover {
    color: #c8c8c8;
  }
`

const UserSettingButton = styled.div`
  color: white;
  display: inline-block;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 30px;
  font-size: 14px;
  &:hover {
    color: #c8c8c8;
  }
  &.header-item-user-home {
    margin-left: 70px;
  }
`

const UserHomeButton = styled.div`
  color: white;
  display: inline-block;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 50px;
  font-size: 14px;
  &:hover {
    color: #c8c8c8;
  }
`

const LoginButton = styled.div`
  color: white;
  display: inline-block;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 800px;
  font-size: 14px;
  &:hover {
    color: #c8c8c8;
  }
`

const CreateUserButton = styled.div`
  color: white;
  display: inline-block;
  cursor: pointer;
  margin-top: 30px;
  margin-left: 70px;
  font-size: 14px;
  &:hover {
    color: #c8c8c8;
  }
`
