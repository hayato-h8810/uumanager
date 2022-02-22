import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '@mui/material/Modal'
import { useCurrentUserQuery, useLogoutMutation, useDeleteUserMutation } from '../api/graphql'
import Header from './header'
import Footer from './footer'

export default function UserHome() {
  const [serverError, setServerError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  const history = useHistory()
  const [logoutMutation] = useLogoutMutation({
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
  const [deleteUserMutation] = useDeleteUserMutation({
    onCompleted: (data) => {
      console.log(data?.deleteUser?.user?.id)
      if (data?.deleteUser?.user?.id) history.push('/')
    },
    onError: (error) => {
      console.log(error)
      if (error?.message === 'PASSWORD_ERROR') {
        setServerError('パスワードが間違っています')
      }
    },
  })

  if (loading) return <h1>ロード中</h1>

  return (
    <>
      <Header />
      <Container>
        <h1>user home</h1>
        <button type="button" onClick={() => logoutMutation()} data-cy="logoutButton">
          ログアウト
        </button>
        <button type="button" onClick={() => handleModalOpen()} data-cy="openModal">
          ユーザー削除モーダル
        </button>
        <ModalContainer open={modalOpen} onClose={handleModalClose}>
          <div className="modalFrame">
            <button type="button" onClick={() => handleModalClose()}>
              閉じる
            </button>
            <div className="inputValue">パスワード</div>
            <input
              type="password"
              onChange={(e) => {
                setPasswordValue(e.target.value)
              }}
              value={passwordValue}
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
      </Container>
      <Footer />
    </>
  )
}

const Container = styled.div``

const ModalContainer = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;
    height: 70vh;
    aspect-ratio: 27/24;
    position: relative;
    right: 0;
    left: 0;
    margin: auto;
    top: 16vh;
  }
`
