import { Button } from '@mui/material'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

export default function ConfirmationMailSend() {
  const history = useHistory()

  return (
    <Container>
      <div className="title">認証メール送信完了</div>
      <div className="information">※まだユーザー作成は完了していません。</div>
      <div className="content">
        入力されたメールアドレスに認証メールを送信しました。
        <br />
        1時間以内にメール本文内の認証urlをクリックすると、登録が完了します。
      </div>
      <Button
        onClick={() => {
          history.push('/')
        }}
        variant="text"
      >
        ホームへ戻る
      </Button>
    </Container>
  )
}

const Container = styled.div`
  text-align: center;
  font-size: 14px;
  .title {
    font-size: 20px;
    padding-top: 120px;
  }
  .information {
    padding-top: 20px;
    color: red;
  }
  .content {
    line-height: 40px;
    padding-top: 70px;
  }
  .MuiButton-root {
    margin-top: 95px;
  }
`
