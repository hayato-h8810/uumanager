import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useCreateUserMutation } from '../api/graphql'

export default function CreateUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const [createuser] = useCreateUserMutation({
    variables: { name, credentials: { password, email } },
    onCompleted: (data) => {
      setName('')
      setEmail('')
      setPassword('')
      // eslint-disable-next-line no-console
      console.log(data.createUser?.id)
      if (data.createUser?.id) {
        history.push(`/${data.createUser.id}`)
      }
    },
  })

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
      <input type="submit" value="新規作成" onClick={() => createuser()} />
    </>
  )
}
