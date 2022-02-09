import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <h1>home component</h1>
      <p>home</p>
      <Link to="/createUser">ユーザー新規作成</Link><br/>
      <Link to="/login">login</Link>
    </>
  )
}
