import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import styled from 'styled-components'
import { User, useSendResetPasswordMailMutation } from '../api/graphql'

interface propsType {
  resetPasswordDialogOpen: boolean
  setResetPasswordDialogOpen: (boolean: boolean) => void
  setResetPasswordInformation: (information: string) => void
  resetPasswordInformation: string
  currentUser: User | null
}

export default function ResetPasswordDialog({ props }: { props: propsType }) {
  const {
    resetPasswordDialogOpen,
    setResetPasswordDialogOpen,
    setResetPasswordInformation,
    resetPasswordInformation,
    currentUser,
  } = props
  const [sendResetPasswordMailMutation, { loading }] = useSendResetPasswordMailMutation({
    onCompleted: () => {
      setResetPasswordInformation(
        'パスワード再設定用メールを送信しました。送信されたメールから、パスワードを変更する事が出来ます。'
      )
    },
    onError: () => {
      setResetPasswordInformation('パスワード再設定用メールの送信に失敗しました。')
    },
  })

  if (loading) {
    return (
      <LoadinDialog open={resetPasswordDialogOpen}>
        <CircularProgress />
      </LoadinDialog>
    )
  }

  return (
    <DialogContainer
      open={resetPasswordDialogOpen}
      onClose={() => {
        setResetPasswordDialogOpen(false)
      }}
    >
      <DialogTitle>パスワードの再設定</DialogTitle>
      {(() => {
        if (loading) {
          return <CircularProgress />
        }
        if (resetPasswordInformation) {
          return (
            <>
              <DialogContent>
                <DialogContentText>{resetPasswordInformation}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setResetPasswordDialogOpen(false)} variant="text">
                  閉じる
                </Button>
              </DialogActions>
            </>
          )
        }
        return (
          <>
            <DialogContent>
              <DialogContentText>
                パスワード再設定用メールから、パスワードを変更することが出来ます。メールを送信しますか？
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setResetPasswordDialogOpen(false)
                }}
                variant="text"
              >
                送信しない
              </Button>
              <Button
                onClick={() => {
                  if (currentUser && currentUser.email)
                    sendResetPasswordMailMutation({ variables: { email: currentUser.email } })
                }}
                variant="text"
              >
                送信する
              </Button>
            </DialogActions>
          </>
        )
      })()}
    </DialogContainer>
  )
}

const LoadinDialog = styled(Dialog)`
  .MuiPaper-root {
    overflow: hidden;
    background: transparent;
    box-shadow: none;
    .MuiCircularProgress-root {
      height: 50px;
      width: 50px;
      color: white;
    }
  }
`

const DialogContainer = styled(Dialog)`
  & .MuiPaper-root {
    background: #2f2f2f;
    color: white;
    & .MuiDialogContentText-root {
      color: white;
    }
  }
`
