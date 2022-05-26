import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useEffect, useState } from 'react'
import { useSendMailForEditEmailMutation } from '../api/graphql'

interface propsType {
  editEmailDialogOpen: boolean
  setEditEmailDialogOpen: (boolean: boolean) => void
}

export default function EditEmailDialog({ props }: { props: propsType }) {
  const { editEmailDialogOpen, setEditEmailDialogOpen } = props
  const [isConfirm, setIsConfirm] = useState(false)
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [inputError, setInputError] = useState(false)
  const [isSentMail, setIsSentMail] = useState(false)
  const [sendMailForEditEmailMutation, { loading }] = useSendMailForEditEmailMutation({
    onCompleted: () => {
      setIsSentMail(true)
      setEmailValue('')
      setPasswordValue('')
    },
    onError: (error) => {
      if (error?.message === 'PASSWORD_ERROR') {
        setInputError(true)
      }
    },
  })

  useEffect(() => {
    if (editEmailDialogOpen) {
      setIsConfirm(false)
      setEmailValue('')
      setPasswordValue('')
      setInputError(false)
      setIsSentMail(false)
    }
  }, [editEmailDialogOpen])

  return (
    <Dialog
      open={editEmailDialogOpen}
      onBackdropClick={() => {
        setEditEmailDialogOpen(false)
      }}
    >
      <DialogTitle>メールアドレス変更</DialogTitle>
      {(() => {
        if (isSentMail) {
          return (
            <>
              <DialogContent>
                <DialogContentText>
                  メールアドレス変更用の確認メールを送信しました。メール本文内の認証URLをクリックすると、メールアドレスの変更が完了します。
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setEditEmailDialogOpen(false)} variant="text">
                  とじる
                </Button>
              </DialogActions>
            </>
          )
        }
        if (isConfirm) {
          return (
            <>
              <DialogContent>
                <DialogContentText>パスワードを入力して下さい。</DialogContentText>
                <TextField
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  error={inputError}
                  type="password"
                  autoFocus
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <LoadingButton
                  onClick={() =>
                    sendMailForEditEmailMutation({ variables: { password: passwordValue, newEmail: emailValue } })
                  }
                  loading={loading}
                  variant="text"
                >
                  決定
                </LoadingButton>
              </DialogActions>
            </>
          )
        }
        return (
          <>
            <DialogContent>
              <DialogContentText>新しいメールアドレスを入力して下さい。</DialogContentText>
              <TextField
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                error={inputError}
                type="text"
                autoFocus
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditEmailDialogOpen(false)} variant="text">
                やめる
              </Button>
              <Button
                onClick={() => {
                  if (!emailValue.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/)) {
                    setInputError(true)
                  } else {
                    setInputError(false)
                    setIsConfirm(true)
                  }
                }}
                variant="text"
              >
                決定
              </Button>
            </DialogActions>
          </>
        )
      })()}
    </Dialog>
  )
}
