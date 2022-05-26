import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useEffect, useState } from 'react'
import { useEditUserNameMutation } from '../api/graphql'

interface propsType {
  editUserNameDialogOpen: boolean
  setEditUserNameDialogOpen: (boolean: boolean) => void
}

export default function EditUserNameDialog({ props }: { props: propsType }) {
  const { editUserNameDialogOpen, setEditUserNameDialogOpen } = props
  const [isConfirm, setIsConfirm] = useState(false)
  const [userNameValue, setUserNameValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [inputError, setInputError] = useState(false)
  const [editUserNameMutation, { loading }] = useEditUserNameMutation({
    onCompleted: () => {
      setEditUserNameDialogOpen(false)
      setUserNameValue('')
      setPasswordValue('')
    },
    onError: (error) => {
      if (error?.message === 'PASSWORD_ERROR') {
        setInputError(true)
      }
    },
  })

  useEffect(() => {
    if (editUserNameDialogOpen) {
      setIsConfirm(false)
      setUserNameValue('')
      setPasswordValue('')
      setInputError(false)
    }
  }, [editUserNameDialogOpen])

  return (
    <Dialog
      open={editUserNameDialogOpen}
      onBackdropClick={() => {
        setEditUserNameDialogOpen(false)
      }}
    >
      <DialogTitle>ユーザー名変更</DialogTitle>
      {isConfirm ? (
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
              onClick={() => editUserNameMutation({ variables: { password: passwordValue, newName: userNameValue } })}
              loading={loading}
              variant="text"
            >
              決定
            </LoadingButton>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <DialogContentText>新しいユーザー名を入力して下さい。</DialogContentText>
            <TextField
              value={userNameValue}
              onChange={(e) => setUserNameValue(e.target.value)}
              error={inputError}
              type="text"
              autoFocus
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUserNameDialogOpen(false)} variant="text">
              やめる
            </Button>
            <Button
              onClick={() => {
                if (!userNameValue) {
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
      )}
    </Dialog>
  )
}
