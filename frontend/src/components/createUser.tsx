import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useCreateUserMutation } from '../api/graphql'

export default function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validateValue, setValidateValue] = useState('')
  const history = useHistory()
  const [createuser, { loading }] = useCreateUserMutation({
    variables: { name, credentials: { password, email } },
    onCompleted: (data) => {
      setName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setValidateValue('')
      console.log(data.createUser?.id)
      if (data.createUser?.id) {
        history.push(`/${data.createUser.id}`)
      }
    },
  })

  if (loading) return <h1>ロード中</h1>

  return (
    <>
      <h1>create_user</h1>
      <label htmlFor="name">
        name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label htmlFor="email">
        email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label htmlFor="password">
        password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <p>{validateValue}</p>
      <br />
      <label htmlFor="password">
        password(確認):
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </label>
      <br />
      <button
        type="button"
        onClick={() => {
          if (password === confirmPassword) {
            createuser()
          } else {
            setValidateValue('入力値が一致しません。')
          }
        }}
      >
        新規作成
      </button>
    </>
  )
}
