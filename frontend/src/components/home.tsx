import { Link } from 'react-router-dom'
import Header from './header'
import Footer from './footer'

export default function Home() {
  return (
    <>
      <Header />
      <h1>home component</h1>
      <p>home</p>
      <Link to="/createUser">ユーザー新規作成</Link>
      <br />
      <Link to="/login">login</Link>
      <Footer />
    </>
  )
}
