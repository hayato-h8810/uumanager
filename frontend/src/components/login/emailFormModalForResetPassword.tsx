import { Modal, TextField, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import styled from 'styled-components'
import { LoadingButton } from '@mui/lab'
import { useSendResetPasswordMailMutation } from '../../api/graphql'

interface propsType {
  emailFormModalForResetPasswordOpen: boolean
  setEmailFormModalForResetPasswordOpen: (boolean: boolean) => void
}

export default function EmailFormModalForResetPassword({ props }: { props: propsType }) {
  const { emailFormModalForResetPasswordOpen, setEmailFormModalForResetPasswordOpen } = props
  const [resetPasswordInformation, setResetPasswordInformation] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState('')
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

  return (
    <Modal
      open={emailFormModalForResetPasswordOpen}
      onClose={() => {
        setEmailFormModalForResetPasswordOpen(false)
        setResetPasswordInformation('')
        setInputValue('')
        setInputError('')
      }}
    >
      <ModalContainer>
        <IconButton
          onClick={() => {
            setEmailFormModalForResetPasswordOpen(false)
            setResetPasswordInformation('')
            setInputValue('')
            setInputError('')
          }}
        >
          <CloseIcon />
        </IconButton>
        <div className="modal-item-title">パスワード再設定</div>
        {resetPasswordInformation ? (
          <div className="modal-item-information">{resetPasswordInformation}</div>
        ) : (
          <div>
            <div className="modal-item-description">
              パスワード再設定用メールから、パスワードを変更することが出来ます。
            </div>
            <div className="modal-item-input-label">メールアドレス</div>
            <TextField
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              type="text"
              variant="outlined"
            />
            <div className="modal-item-error">{inputError}</div>
            <br />
            <LoadingButton
              onClick={() => {
                if (!inputValue) {
                  setInputError('メールアドレスを入力してください。')
                } else if (!inputValue.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/)) {
                  setInputError('無効なメールアドレスです。')
                } else {
                  sendResetPasswordMailMutation({ variables: { email: inputValue } })
                }
              }}
              loading={loading}
              variant="contained"
              type="submit"
            >
              確定
            </LoadingButton>
          </div>
        )}
      </ModalContainer>
    </Modal>
  )
}

const ModalContainer = styled.div`
  background: white;
  height: 450px;
  width: 550px;
  margin: auto;
  margin-top: 190px;
  text-align: center;
  font-size: 14px;
  .MuiIconButton-root {
    margin-left: 450px;
    margin-top: 15px;
    .MuiSvgIcon-root {
    }
  }
  .modal-item-title {
    font-size: 20px;
    margin-top: 30px;
  }
  .modal-item-information {
    margin: auto;
    margin-top: 100px;
    max-width: 450px;
  }
  .modal-item-description {
    margin-top: 20px;
  }
  .modal-item-input-label {
    margin-top: 50px;
    text-align: left;
    margin-left: 130px;
  }
  .MuiTextField-root {
    margin-top: 20px;
    input {
      padding: 4px 12px;
      width: 270px;
      font-size: 14px;
    }
  }
  .modal-item-error {
    height: 20px;
    font-size: 12px;
    margin-top: 10px;
    color: red;
  }
  .MuiLoadingButton-root {
    font-size: 14px;
    background: #20a1ff;
    padding: 4px 12px;
    margin-top: 50px;
    &:hover {
      background: #0f8ce5;
    }
  }
`
