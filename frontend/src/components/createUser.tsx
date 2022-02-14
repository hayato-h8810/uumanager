import { useHistory } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
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

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
    createUser({ variables: { name: data.name, credentials: { password: data.password, email: data.email } } })
  }

  if (loading) return <h1>ロード中</h1>

  return (
    <>
      <h1>create_user</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">
          name:
          <br />
          {errors.name && <p className="error">名前欄の入力は必須です</p>}
          <br />
          <input {...register('name', { required: true })} id="name" type="text" />
        </label>
        <br />
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
          password(6文字以上、12文字以下):
          <br />
          {errors.password?.message}
          <br />
          <input
            {...register('password', {
              required: { value: true, message: 'パスワード欄の入力は必須です' },
              minLength: { value: 6, message: 'パスワードは6文字以上、12文字以下で入力して下さい' },
              maxLength: { value: 12, message: 'パスワードは6文字以上、12文字以下で入力して下さい' },
            })}
            id="password"
            type="password"
          />
        </label>
        <br />
        <label htmlFor="confirmPassword">
          password(確認):
          <br />
          {errors.confirmPassword && <p className="error">入力値が一致しません</p>}
          <br />
          <input
            {...register('confirmPassword', { validate: (value) => getValues('password') === value })}
            id="confirmPassword"
            type="password"
          />
        </label>
        <br />
        {sessionServerError}
        <br />
        <button
          type="submit"
          onClick={() => {
            setEmailServerError('')
            setSessionServerError('')
          }}
        >
          新規作成
        </button>
      </form>
    </>
  )
}
