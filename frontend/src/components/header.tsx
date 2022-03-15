import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '@mui/material/Modal'
import { useCurrentUserQuery, useLogoutMutation, useDeleteUserMutation } from '../api/graphql'

export default function Header() {
  const [serverError, setServerError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const { data: { currentUser = null } = {}, refetch } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
  })
  const [logoutMutation] = useLogoutMutation({
    onCompleted: (data) => {
      if (!data?.logout?.id) {
        history.push('/')
        refetch()
      }
    },
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
        <button type="button" onClick={() => logoutMutation()} data-cy="logoutButton">
          ログアウト
        </button>
        <button type="button" onClick={() => setModalOpen(true)} data-cy="openModal">
          ユーザー削除モーダル
        </button>
        <ModalContainer open={modalOpen} onBackdropClick={() => setModalOpen(false)}>
          <div className="modalFrame">
            <button type="button" onClick={() => setModalOpen(false)}>
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
        {location.pathname !== '/userHome' && (
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


