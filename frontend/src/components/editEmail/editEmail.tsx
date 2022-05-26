import { Button, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useEditEmailMutation } from '../../api/graphql'

interface RouterParams {
  editEmailToken: string
}

export default function EditEmail() {
  const { editEmailToken } = useParams<RouterParams>()
  const [information, setInformation] = useState('')
  const history = useHistory()
  const [editEmailMutation, { loading }] = useEditEmailMutation({
    onCompleted: () => {
      setInformation('メールアドレスの変更が完了しました。')
    },
    onError: (error) => {
      if (error.message === 'TIMEOUT_ERROR') {
        setInformation('このURLは有効期限切れです。')
      } else if (error.message === 'INVALID_TOKEN_ERROR') {
        setInformation('無効なURLです。')
      }
      setInformation('メールアドレスの変更に失敗しました。')
    },
  })

  useEffect(() => {
    const userId = editEmailToken.match(/^\d+-(\d+)/)
    const newEmail = editEmailToken.match(/^\d+-\d+-(.+)$/)
    if (userId && newEmail) {
      editEmailMutation({ variables: { id: userId[1], newEmail: newEmail[1] } })
    } else {
      setInformation('無効なURLです。')
    }
  }, [])

  return (
    <Container>
      <div>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {information}
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
      </div>
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
