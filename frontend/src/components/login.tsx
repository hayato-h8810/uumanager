import { useForm, SubmitHandler } from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'
import { useLoginMutation } from '../api/graphql'

type FormInput = {
  email: string
  password: string
}

export default function Login() {
  const [emailServerError, setEmailServerError] = useState('')
  const [passwordServerError, setPasswordServerError] = useState('')
  const [sessionServerError, setSessionServerError] = useState('')
  const history = useHistory()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })

  const [loginMutation] = useLoginMutation({
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

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
    loginMutation({ variables: { credentials: { password: data.password, email: data.email } } })
  }

  return (
    <>
      <h1>login</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email">
          email:
          <br />
          {emailServerError}
          {errors.email?.message}
          <br />
          <input
            {...register('email', {
              required: { value: true, message: 'email欄の入力は必須です' },
              pattern: {
                value: /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]+\.[A-Za-z0-9]+$/,
                message: '無効なメールアドレスです',
              },
            })}
            id="email"
            type="text"
          />
        </label>
        <br />
        <label htmlFor="password">
          password:
          <br />
          {passwordServerError}
          {errors.password && <p className="error">パスワード欄の入力は必須です</p>}
          <br />
          <input {...register('password', { required: true })} id="password" type="password" />
        </label>
        <br />
        {sessionServerError}
        <br />
        <button
          type="submit"
          onClick={() => {
            setEmailServerError('')
            setPasswordServerError('')
            setSessionServerError('')
          }}
        >
          ログイン
        </button>
      </form>
    </>
  )
}
