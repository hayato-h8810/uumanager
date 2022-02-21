import { useHistory } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import LoadingButton from '@mui/lab/LoadingButton'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useCreateUserMutation } from '../api/graphql'

type FormInput = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function CreateUser() {
  const [emailServerError, setEmailServerError] = useState('')
  const [sessionServerError, setSessionServerError] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const history = useHistory()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })

  const [createUser, { loading }] = useCreateUserMutation({
    onCompleted: (data) => {
      console.log(data.createUser?.id)
      if (data.createUser?.id) {
        history.push(`/${data.createUser.id}`)
      }
    },
    onError: (error) => {
      console.log(error)
      if (error?.message === 'EMAIL_ERROR') {
        setEmailServerError('このメールアドレスは既に使用されています')
      } else if (error?.message === 'SESSION_ERROR') {
        setSessionServerError('既にログインしています。一度ログアウトしてからお試しください。')
      }
    },
  })

  useEffect(() => {
    if (loading) {
      setLoadingButton(true)
    } else {
      setLoadingButton(false)
    }
  }, [loading])

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
    createUser({ variables: { name: data.name, credentials: { password: data.password, email: data.email } } })
  }

  return (
    <Container>
      <h1>ユーザー新規作成</h1>
      <Stack direction="row" spacing={54.5} className="stack">
        <IconButton>
          <RefreshIcon style={{ color: '#adadad', fontSize: '30px' }} />
        </IconButton>
        <div className="questionIcon">
          <IconButton>
            <QuestionMarkIcon style={{ color: 'white', fontSize: '15px' }} />
          </IconButton>
        </div>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputContainer">
          <div className="inputLabel">
            <div className="inputValue">名前:</div>
            <TextField {...register('name', { required: true })} type="text" label="名前" variant="outlined" />
          </div>
          <div className="nameErrorContainer">
            {errors.name && (
              <div className="error">
                <p className="errorValue">名前欄の入力は必須です</p>
              </div>
            )}
          </div>
          <div className="inputLabel">
            <div className="inputValue">メールアドレス:</div>
            <TextField
              {...register('email', {
                required: { value: true, message: 'email欄の入力は必須です' },
                pattern: {
                  value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/,
                  message: '無効なメールアドレスです',
                },
              })}
              type="text"
              label="メールアドレス"
              variant="outlined"
            />
          </div>
          <div className="emailErrorContainer">
            {emailServerError !== '' && (
              <div className="error">
                <p className="errorValue">{emailServerError}</p>
              </div>
            )}
            {errors.email?.message && (
              <div className="error">
                <p className="errorValue">{errors.email.message}</p>
              </div>
            )}
          </div>
          <div className="inputLabel">
            <div className="inputValue">パスワード:</div>
            <TextField
              {...register('password', {
                required: { value: true, message: 'パスワード欄の入力は必須です' },
                minLength: { value: 6, message: 'パスワードは6文字以上、12文字以下です' },
                maxLength: { value: 12, message: 'パスワードは6文字以上、12文字以下です' },
              })}
              type="password"
              label="パスワード(6文字以上、12文字以下)"
              variant="outlined"
            />
          </div>
          <div className="passwordErrorContainer">
            {errors.password?.message && (
              <div className="error">
                <p className="errorValue">{errors.password.message}</p>
              </div>
            )}
          </div>
          <div className="inputLabel">
            <div className="inputValue">パスワード(確認):</div>
            <TextField
              {...register('confirmPassword', { validate: (value) => getValues('password') === value })}
              type="password"
              label="パスワード(確認)"
              variant="outlined"
            />
          </div>
          <div className="confirmPasswordErrorContainer">
            {errors.confirmPassword && (
              <div className="error">
                <p className="errorValue">入力値が一致しません</p>
              </div>
            )}
          </div>
        </div>
        {sessionServerError !== '' && (
          <div className="serverErrorcontainer">
            <p className="errorValue">{sessionServerError}</p>
          </div>
        )}
        <LoadingButton
          loading={loadingButton}
          variant="contained"
          type="submit"
          onClick={() => {
            setEmailServerError('')
            setSessionServerError('')
          }}
        >
          登録
        </LoadingButton>
      </form>
    </Container>
  )
}

const Container = styled.div`
  background: #fefefe;
  height: 70vh;
  aspect-ratio: 27/24;
  position: relative;
  right: 0;
  left: 0;
  margin: auto;
  top: 16vh;
  > h1 {
    font-size: 30px;
    position: absolute;
    left: 30%;
    margin: auto;
    top: 10%;
  }
  .stack {
    position: absolute;
    left: 6%;
    top: 5%;
    .questionIcon {
      margin-top: 5px;
      .MuiIconButton-root {
        background: #ffc120;
      }
    }
  }
  .inputContainer {
    position: relative;
    top: 130px;
    padding-top: 30px;
    padding-bottom: 10px;
    margin-left: auto;
    margin-right: auto;
    width: 440px;
    border-top: 1px solid #b4b4b4;
    border-bottom: 1px solid #b4b4b4;
    .inputLabel {
      padding-bottom: 70px;
      .inputValue {
        padding-top: 5px;
        display: inline-block;
        position: absolute;
        right: 65%;
        font-size: 14px;
        z-index: 2;
      }
      .MuiTextField-root {
        width: 225px;
        position: absolute;
        right: 10%;
        z-index: 2;
      }
      .MuiTextField-root label {
        font-size: 0.7rem;
        top: -7px;
      }
      .MuiTextField-root input {
        height: 0.01rem;
        font-size: 0.8rem;
        font-weight: normal;
        background-color: #ffffff;
      }
    }
    .nameErrorContainer {
      background: #f6f6f6;
      height: 30px;
      width: 100%;
      position: absolute;
      top: 14%;
      z-index: 1;
      .error {
        background: #f6f6f6;
        height: 37px;
        position: relative;
        .errorValue {
          font-size: 11px;
          position: absolute;
          left: 40%;
          top: 17%;
          color: red;
        }
      }
    }
    .emailErrorContainer {
      background: #f6f6f6;
      height: 30px;
      width: 100%;
      position: absolute;
      top: 36%;
      z-index: 1;
      .error {
        background: #f6f6f6;
        height: 37px;
        position: relative;
        .errorValue {
          font-size: 11px;
          position: absolute;
          left: 40%;
          top: 17%;
          color: red;
        }
      }
    }
    .passwordErrorContainer {
      background: #f6f6f6;
      height: 30px;
      width: 100%;
      position: absolute;
      top: 58%;
      z-index: 1;
      .error {
        background: #f6f6f6;
        height: 37px;
        position: relative;
        .errorValue {
          font-size: 11px;
          position: absolute;
          left: 40%;
          top: 17%;
          color: red;
        }
      }
    }
    .confirmPasswordErrorContainer {
      background: #f6f6f6;
      height: 30px;
      width: 100%;
      position: absolute;
      top: 80%;
      z-index: 1;
      .error {
        background: #f6f6f6;
        height: 37px;
        position: relative;
        .errorValue {
          font-size: 11px;
          position: absolute;
          left: 40%;
          top: 17%;
          color: red;
        }
      }
    }
  }
  .MuiLoadingButton-root {
    position: absolute;
    top: 87%;
    left: 45%;
    background: #20a1ff;
  }
  .serverErrorcontainer {
    height: 30px;
    width: 100%;
    position: absolute;
    top: 81.5%;
    .errorValue {
      font-size: 11px;
      color: red;
      text-align: center;
    }
  }
`
