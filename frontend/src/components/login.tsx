import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useLoginMutation } from '../api/graphql'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const [loginMutation] = useLoginMutation({
    variables: { credentials: { password, email } },
    onCompleted: (data) => {
      setEmail('')
      setPassword('')
      // eslint-disable-next-line no-console
      console.log(data.login?.user?.id)
      if (data.login?.user) {
        history.push(`/${data.login.user.id}`)
      }
    },
  })

  return (
    <>
      <h1>login</h1>
      <label htmlFor="email">
        email:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label htmlFor="password">
        password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <input onClick={() => loginMutation()} type="submit" value="ログイン" />
    </>
  )
}
