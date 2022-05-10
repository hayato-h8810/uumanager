import styled from 'styled-components'
import format from 'date-fns/format'
import { useCurrentUserQuery, useFetchLoginHistoryQuery } from '../../../api/graphql'

export default function UserDescription() {
  const { data: { currentUser = null } = {} } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
  })
  const { data: { fetchLoginHistory = null } = {} } = useFetchLoginHistoryQuery({
    fetchPolicy: 'network-only',
  })

  const lastLogin = () => {
    if (fetchLoginHistory?.length) {
      const copyArray = [...fetchLoginHistory]
      copyArray.sort((a, b) => {
        if (a?.date && b?.date) {
          return a?.date < b?.date ? 1 : -1
        }
        return 1
      })
      if (copyArray?.length === 1) {
        return copyArray[0].date
      }
      if (copyArray?.length !== 1 && copyArray[0].date === format(new Date(), 'yyyy-MM-dd')) {
        return copyArray[1].date
      }
      return copyArray[0].date
    }
    return null
  }

  return (
    <Container>
      <Title>{currentUser?.name}</Title>
      <Contents>
        <div className="item odd-row">
          <div className="label">メールアドレス</div>
          <div className="value">{currentUser?.email}</div>
        </div>
        <div className="item">
          <div className="label">アカウント作成日</div>
          <div className="value">{currentUser && format(new Date(1000 * currentUser.createdAt), 'yyyy-MM-dd')}</div>
        </div>
        <div className="item odd-row">
          <div className="label">前回ログイン</div>
          <div className="value">{fetchLoginHistory && lastLogin()}</div>
        </div>
      </Contents>
    </Container>
  )
}

const Container = styled.div`
  grid-area: userDiscription;
  margin-left: 30px;
`

const Title = styled.h1`
  padding-top: 5px;
  padding-left: 70px;
  font-weight: normal;
  font-size: 20px;
`
const Contents = styled.div`
  padding-top: 10px;
  padding-left: 110px;
  font-size: 14px;
  .item {
    position: relative;
    height: 43px;
    width: 670px;
    .label {
      position: absolute;
      top: 11px;
      left: 50px;
    }
    .value {
      position: absolute;
      top: 11px;
      left: 320px;
      max-width: 300px;
      overflow: auto;
      white-space: nowrap;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }
  .odd-row {
    background: #f4f4f4;
  }
`
