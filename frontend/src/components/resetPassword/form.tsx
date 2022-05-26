import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import styled from 'styled-components'
import { useResetPasswordMutation } from '../../api/graphql'

interface RouterParams {
  resetPasswordToken: string
}

type FormInput = {
  password: string
  confirmPassword: string
}

export default function Form() {
  const { resetPasswordToken } = useParams<RouterParams>()
  const [information, setInformation] = useState('')
  const history = useHistory()
  const [resetPasswordMutation, { loading }] = useResetPasswordMutation({
    onCompleted: () => {
      reset()
      setInformation('パスワードの変更が完了しました。')
    },
    onError: (error) => {
      if (error.message === 'TIMEOUT_ERROR') {
        setInformation('有効期限切れです。')
      } else if (error.message === 'INVALID_TOKEN_ERROR') {
        setInformation(
          'パスワードの変更に失敗しました。お手数ですが、もう一度パスワード変更メールの送信からお試し下さい。'
        )
      }
    },
  })
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const token = resetPasswordToken.match(/^\d+-([\da-zA-Z]+)-/)
    const email = resetPasswordToken.match(/^\d+-[\da-zA-Z]+-(.+)$/)
    if (token && email)
      resetPasswordMutation({
        variables: { email: email[1], newPassword: data.password, resetPasswordToken: token[1] },
      })
  }
  useEffect(() => {
    const resetPasswordMailSentTimestanp = resetPasswordToken.match(/^\d+/)
    const token = resetPasswordToken.match(/^\d+-([\da-zA-Z]+)-/)
    const email = resetPasswordToken.match(/^\d+-[\da-zA-Z]+-(.+)$/)
    if (resetPasswordMailSentTimestanp) {
      const resetPasswordMailSentDate = new Date(Number(resetPasswordMailSentTimestanp[0]) * 1000)
      const currentDate = new Date()
      if (Math.floor((currentDate.getTime() - resetPasswordMailSentDate.getTime()) / (1000 * 3600)) >= 1) {
        setInformation('有効期限切れです。')
      }
    }
    if (!token || !email) {
      setInformation('無効なURLです。')
    }
  }, [])

  return (
    <Container>
      <div className="container-item-frame">
        <div className="container-item-title">パスワードの再設定</div>
        {information ? (
          <InformationContainer>
            <div className="information-item-value">{information}</div>
            <Button onClick={() => history.push('/')} variant="text">
              戻る
            </Button>
          </InformationContainer>
        ) : (
          <InputFieldContainer>
            <div className="input-field-item-description">新しいパスワードを入力してください。</div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-field-item-label">パスワード(6文字から12文字)</div>
              <TextField
                {...register('password', {
                  required: { value: true, message: 'パスワード欄の入力は必須です' },
                  minLength: { value: 6, message: 'パスワードは6文字以上、12文字以下です' },
                  maxLength: { value: 12, message: 'パスワードは6文字以上、12文字以下です' },
                })}
                type="password"
                variant="outlined"
              />
              <div className="input-field-item-error">{errors.password?.message}</div>
              <div className="input-field-item-label">パスワード(確認用)</div>
              <TextField
                {...register('confirmPassword', { validate: (value) => getValues('password') === value })}
                type="password"
                variant="outlined"
              />
              <div className="input-field-item-error">
                {errors.confirmPassword && !errors.password && '入力値が一致しません'}
              </div>
              <LoadingButton loading={loading} variant="contained" type="submit">
                確定
              </LoadingButton>
            </form>
          </InputFieldContainer>
        )}
      </div>
    </Container>
  )
}

const Container = styled.div`
  background: white;
  height: 659px;
  text-align: center;
  font-size: 14px;
  .container-item-frame {
    display: inline-block;
    margin: auto;
    margin-top: 90px;
    height: 460px;
    width: 500px;
    border: solid 1px #646464;
    border-radius: 3px;
    .container-item-title {
      font-size: 20px;
      margin-top: 60px;
    }
  }
`

const InformationContainer = styled.div`
  .information-item-value {
    margin: auto;
    margin-top: 120px;
    max-width: 450px;
  }
  .MuiButton-root {
    margin-top: 90px;
  }
`

const InputFieldContainer = styled.div`
  .input-field-item-description {
    margin: 35px;
  }
  .input-field-item-label {
    text-align: left;
    margin-left: 103px;
    margin-bottom: 2px;
  }
  .MuiTextField-root {
    margin-top: 10px;
    input {
      font-size: 14px;
      padding: 4px 12px;
      width: 270px;
    }
  }
  .input-field-item-error {
    height: 20px;
    margin-top: 5px;
    margin-bottom: 10px;
    color: red;
    font-size: 12px;
  }
  .MuiLoadingButton-root {
    margin-top: 20px;
    padding: 4px 12px;
  }
`
