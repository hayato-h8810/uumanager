import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useLogoutMutation, User } from '../api/graphql'
import ResetPasswordDialog from './resetPasswordDialog'
import DeleteUserDialog from './deleteUserDialog'

type CustomProps = {
  anchorElLeft: number | undefined
  anchorElTop: number | undefined
}

interface propsType {
  anchorEl: HTMLElement | null
  setAnchorEl: (element: HTMLElement | null) => void
  currentUser: User | null
  refetch: () => void
}

export default function UserSettingBalloon({ props }: { props: propsType }) {
  const { anchorEl, setAnchorEl, currentUser, refetch } = props
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [resetPasswordInformation, setResetPasswordInformation] = useState('')
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)
  const history = useHistory()
  const [logoutMutation] = useLogoutMutation({
    onCompleted: (data) => {
      if (!data?.logout?.id) {
        history.push('/')
        refetch()
      }
    },
  })

  return (
    <>
      <BackdropContainer
        onClick={() => {
          setAnchorEl(null)
        }}
      >
        <BalloonContainer
          anchorElLeft={anchorEl?.getBoundingClientRect().left}
          anchorElTop={anchorEl?.getBoundingClientRect().bottom}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="balloon-item-frame">
            <Header>
              <div className="header-item-label">ログインユーザー</div>
              <div className="header-item-user-name">{currentUser?.name}</div>
            </Header>
            <Options>
              <div
                onClick={() => {
                  setResetPasswordDialogOpen(true)
                  setResetPasswordInformation('')
                }}
                className="options-item-option"
                role="button"
                tabIndex={0}
              >
                パスワード変更
              </div>
              <div
                onClick={() => {
                  setAnchorEl(null)
                  logoutMutation()
                }}
                className="options-item-option"
                role="button"
                tabIndex={0}
              >
                ログアウト
              </div>
              <div
                onClick={() => setDeleteUserDialogOpen(true)}
                className="options-item-option"
                role="button"
                tabIndex={0}
              >
                ユーザー削除
              </div>
            </Options>
          </div>
        </BalloonContainer>
      </BackdropContainer>
      <ResetPasswordDialog
        props={{
          resetPasswordDialogOpen,
          setResetPasswordDialogOpen,
          setResetPasswordInformation,
          resetPasswordInformation,
          currentUser,
        }}
      />
      <DeleteUserDialog props={{ deleteUserDialogOpen, setDeleteUserDialogOpen, refetch }} />
    </>
  )
}

const BackdropContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const BalloonContainer = styled.div<CustomProps>`
  position: absolute;
  left: ${(props) => props.anchorElLeft}px;
  top: ${(props) => props.anchorElTop && props.anchorElTop + 10}px;
  z-index: 2000;
  font-size: 14px;
  .balloon-item-frame {
    position: relative;
    width: 150px;
    background: white;
    box-shadow: 0px 2px 20px -7px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    border: 1px solid #c5c5c5;
    &::before {
      position: absolute;
      top: -20px;
      left: 10px;
      content: '';
      border: 10px solid transparent;
      border-bottom: 10px solid #c5c5c5;
    }
    &::after {
      position: absolute;
      top: -18px;
      left: 10px;
      content: '';
      border: 10px solid transparent;
      border-bottom: 10px solid white;
    }
  }
`

const Header = styled.div`
  border-bottom: 1px solid #c5c5c5;
  .header-item-label {
    color: #777;
    margin-left: 20px;
    margin-top: 10px;
  }
  .header-item-user-name {
    margin-left: 20px;
    margin-bottom: 10px;
    max-width: 120px;
    word-wrap: break-word;
  }
`
const Options = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  .options-item-option {
    color: #777;
    padding: 5px 20px;
    &:hover {
      background: #1271ff;
      color: white;
      cursor: pointer;
    }
  }
`
