import { useForm, SubmitHandler } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useLoginMutation } from '../api/graphql'

type FormInput = {
  email: string
  password: string
}

export default function Login() {
  const [emailServerError, setEmailServerError] = useState('')
  const [passwordServerError, setPasswordServerError] = useState('')
  const [sessionServerError, setSessionServerError] = useState('')
  const [loadingButton, setLoadingButton] = useState(false)
  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })

  const [loginMutation, { loading }] = useLoginMutation({
    onCompleted: (data) => {
      console.log(data.login?.user?.id)
      if (data.login?.user) {
        history.push(`/${data.login.user.id}`)
      }
    },
    onError: (error) => {
      console.log(error.message)
      if (error?.message === 'EMAIL_ERROR') {
        setEmailServerError('このメールアドレスは登録されていません')
      } else if (error?.message === 'PASSWORD_ERROR') {
        setPasswordServerError('パスワードが正しくありません')
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
    loginMutation({ variables: { credentials: { password: data.password, email: data.email } } })
  }

  return (
    <Container>
      <h1>login</h1>
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
            <div className="inputValue">メールアドレス:</div>
            <TextField
              {...register('email', {
                required: { value: true, message: 'メールアドレス欄の入力は必須です' },
                pattern: {
                  value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/,
                  message: '無効なメールアドレスです',
                },
              })}
              type="text"
              variant="outlined"
              label="メールアドレス"
              inputProps={{
                'data-cy': 'email',
              }}
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
                <p className="errorValue" data-cy="errorMessage">
                  {errors.email.message}
                </p>
              </div>
            )}
          </div>
          <div className="inputLabel">
            <div className="inputValue">パスワード:</div>
            <TextField
              {...register('password', { required: true })}
              type="password"
              variant="outlined"
              label="パスワード"
              inputProps={{
                'data-cy': 'password',
              }}
            />
          </div>
          <div className="passwordErrorContainer">
            {passwordServerError !== '' && (
              <div className="error">
                <p className="errorValue" data-cy="errorMessage">
                  {passwordServerError}
                </p>
              </div>
            )}
            {errors.password && (
              <div className="error">
                <p className="errorValue">パスワード欄の入力は必須です</p>
              </div>
            )}
          </div>
        </div>
        {sessionServerError !== '' && (
          <div className="serverErrorcontainer">
            <p className="errorValue" data-cy="errorMessage">
              {sessionServerError}
            </p>
          </div>
        )}
        <LoadingButton
          loading={loadingButton}
          variant="contained"
          type="submit"
          onClick={() => {
            setEmailServerError('')
            setPasswordServerError('')
            setSessionServerError('')
          }}
          data-cy="button"
        >
          ログイン
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
    left: 43%;
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
    padding-top: 75px;
    height: 250px;
    margin-left: auto;
    margin-right: auto;
    width: 440px;
    border-top: 1px solid #b4b4b4;
    border-bottom: 1px solid #b4b4b4;
    .inputLabel {
      padding-bottom: 130px;
      .inputValue {
        padding-top: 5px;
        display: inline-block;
        position: absolute;
        right: 65%;
        font-size: 13px;
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
    .emailErrorContainer {
      background: #f6f6f6;
      height: 30px;
      width: 100%;
      position: absolute;
      top: 28%;
      z-index: 1;
      .error {
        background: #f6f6f6;
        height: 37px;
        position: relative;
        .errorValue {
          font-size: 11px;
          position: absolute;
          left: 40%;
          top: 18%;
          color: red;
        }
      }
    }
    .passwordErrorContainer {
      background: #f6f6f6;
      height: 30px;
      width: 100%;
      position: absolute;
      top: 68%;
      z-index: 1;
      .error {
        background: #f6f6f6;
        height: 37px;
        position: relative;
        .errorValue {
          font-size: 11px;
          position: absolute;
          left: 40%;
          top: 18%;
          color: red;
        }
      }
    }
  }
  .MuiLoadingButton-root {
    position: absolute;
    top: 87%;
    left: 42%;
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
