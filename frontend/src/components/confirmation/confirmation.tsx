import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useCreateUserMutation } from '../../api/graphql'

interface RouterParams {
  confirmationToken: string
}

export default function Confirmation() {
  const { confirmationToken } = useParams<RouterParams>()
  const [errorValue, setErrorValue] = useState('')
  const [countdown, setCountdown] = useState(0)
  const history = useHistory()
  const [createUserMutation, { loading }] = useCreateUserMutation({
    onCompleted: () => {
      setCountdown(5)
      setTimeout(() => history.push('/userHome'), 5000)
    },
    onError: (error) => {
      if (error.message === 'INVALID_URL_ERROR') {
        setErrorValue('無効なurlです。')
      } else if (error.message === 'EMAIL_ERROR') {
        setErrorValue('このメールアドレスは既に使用されています。')
      } else if (error.message === 'TIMEOUT_ERROR') {
        setErrorValue('urlの期限が切れています。')
      }
    },
  })

  useEffect(() => {
    createUserMutation({ variables: { confirmationToken } })
  }, [])

  useEffect(() => {
    if (countdown !== 0) {
      setTimeout(() => setCountdown((time) => time - 1), 1000)
    }
  }, [countdown])

  if (loading)
    return (
      <Container>
        <div>検証中...</div>
      </Container>
    )

  return (
    <Container>
      {!errorValue ? (
        <div>
          ユーザー作成が完了しました。
          <br />
          {countdown}秒後にユーザーのホームへ移動します。
        </div>
      ) : (
        <>
          <div>
            ユーザー作成に失敗しました。
            <br />
            {errorValue}
          </div>
          <br />
          <Button
            onClick={() => {
              history.push('/')
            }}
            variant="text"
          >
            ホームへ
          </Button>
        </>
      )}
    </Container>
  )
}

const Container = styled.div`
  text-align: center;
  height: 659px;
  background: white;
  div {
    line-height: 40px;
    margin-top: 270px;
    display: inline-block;
  }
  .MuiButton-root {
    margin-top: 30px;
  }
`
