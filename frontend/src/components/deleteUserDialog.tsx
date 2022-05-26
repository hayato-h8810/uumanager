import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useDeleteUserMutation } from '../api/graphql'

interface propsType {
  deleteUserDialogOpen: boolean
  setDeleteUserDialogOpen: (boolean: boolean) => void
  refetch: () => void
}

export default function DeleteUserDialog({ props }: { props: propsType }) {
  const { deleteUserDialogOpen, setDeleteUserDialogOpen, refetch } = props
  const [isDelete, setIsDelete] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const history = useHistory()
  const [deleteUserMutation, { loading }] = useDeleteUserMutation({
    onCompleted: (data) => {
      if (data?.deleteUser?.user?.id) {
        history.push('/')
        refetch()
      }
    },
    onError: (error) => {
      if (error?.message === 'PASSWORD_ERROR') {
        setPasswordError(true)
      }
    },
  })

  useEffect(() => {
    if (deleteUserDialogOpen) {
      setIsDelete(false)
      setPasswordError(false)
    }
  }, [deleteUserDialogOpen])

  return (
    <DialogContainer
      open={deleteUserDialogOpen}
      onBackdropClick={() => {
        setDeleteUserDialogOpen(false)
      }}
    >
      <DialogTitle>ユーザの削除</DialogTitle>
      {isDelete ? (
        <>
          <DialogContent>
            <DialogContentText>パスワードを入力して下さい。</DialogContentText>
            <TextField
              value={passwordValue}
              onChange={(e) => setPasswordValue(e.target.value)}
              error={passwordError}
              type="password"
              autoFocus
              fullWidth
              variant="standard"
            />
            {passwordError && (
              <DialogContentText className="error-value">パスワードが間違っています。</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <LoadingButton
              onClick={() => deleteUserMutation({ variables: { password: passwordValue } })}
              loading={loading}
              variant="text"
            >
              確認
            </LoadingButton>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <DialogContentText>一度削除したユーザーを復元することは出来ません。本当に削除しますか？</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteUserDialogOpen(false)} variant="text">
              削除しない
            </Button>
            <Button onClick={() => setIsDelete(true)} variant="text">
              削除する
            </Button>
          </DialogActions>
        </>
      )}
    </DialogContainer>
  )
}

const DialogContainer = styled(Dialog)`
  & .MuiPaper-root {
    background: #2f2f2f;
    color: white;
    & .MuiDialogContentText-root {
      color: white;
    }
    .error-value {
      color: #d32f2f;
      font-size: 14px;
    }
    .MuiTextField-root {
      .MuiInput-root {
        &::before {
          border-bottom: 1px solid white;
        }
      }
      input {
        color: white;
      }
    }
    .MuiLoadingButton-root .MuiLoadingButton-loadingIndicator {
      color: #1976d2;
    }
  }
`
