import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '@mui/material/Modal'
import { useCurrentUserQuery, useDeleteUserMutation } from '../api/graphql'
import ResetPasswordDialog from './resetPasswordDialog'
import UserSettingBalloon from './userSettingBalloon'

export default function Header() {
  const [serverError, setServerError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [userDeletemodalOpen, setUserDeleteModalOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [resetPasswordInformation, setResetPasswordInformation] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const history = useHistory()
  const location = useLocation()
  const { data: { currentUser = null } = {}, refetch } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
  })

  const [deleteUserMutation] = useDeleteUserMutation({
    onCompleted: (data) => {
      if (data?.deleteUser?.user?.id) {
        history.push('/')
        refetch()
      }
    },
    onError: (error) => {
      if (error?.message === 'PASSWORD_ERROR') {
        setServerError('パスワードが間違っています')
      }
    },
  })

  if (currentUser) {
    return (
      <HeaderContainer>
        <UserSettingButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget)
          }}
          className="header-item-user-setting"
          role="button"
          tabIndex={0}
        >
          ユーザー設定
        </UserSettingButton>
        {anchorEl && (
          <UserSettingBalloon
            props={{
              setResetPasswordDialogOpen,
              setResetPasswordInformation,
              setUserDeleteModalOpen,
              anchorEl,
              setAnchorEl,
              currentUser,
              refetch,
            }}
          />
        )}
        <ResetPasswordDialog
          props={{
            resetPasswordDialogOpen,
            setResetPasswordDialogOpen,
            setResetPasswordInformation,
            resetPasswordInformation,
            currentUser,
          }}
        />
        <ModalContainer open={userDeletemodalOpen} onBackdropClick={() => setUserDeleteModalOpen(false)}>
          <div className="modalFrame">
            <button type="button" onClick={() => setUserDeleteModalOpen(false)}>
              閉じる
            </button>
            <div className="inputValue">パスワード</div>
            <input
              type="password"
              onChange={(e) => {
                setPasswordValue(e.target.value)
              }}
              value={passwordValue}
              data-cy="password"
            />
            {serverError !== '' && <p className="errorValue">{serverError}</p>}
            <button
              type="button"
              onClick={() => deleteUserMutation({ variables: { password: passwordValue } })}
              data-cy="deleteUserButton"
            >
              ユーザー削除
            </button>
          </div>
        </ModalContainer>
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
  .header-item-user-setting {
    display: inline-block;
  }
`

const UserSettingButton = styled.div`
  color: white;
  cursor: pointer;
  margin-top: 20px;
  margin-left: 100px;
  &:hover {
    color: #c8c8c8;
  }
`

const ModalContainer = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;
    position: relative;
  }
`
