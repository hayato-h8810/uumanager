import { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useFetchBrowsingHistoryQuery, BrowsingHistory } from '../../../api/graphql'

interface RouterParams {
  id: string
}

export default function BrowsingHistories() {
  const { id } = useParams<RouterParams>()
  const [histories, setHistories] = useState<BrowsingHistory[]>([])
  const history = useHistory()
  const { data: { fetchBrowsingHistory = null } = {} } = useFetchBrowsingHistoryQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      const historiesArray = fetchBrowsingHistory?.filter((data) => data.urlId === id)
      if (historiesArray) {
        setHistories(
          historiesArray
            .sort((a, b) => {
              if (a?.date && b?.date) {
                return a?.date < b?.date ? 1 : -1
              }
              return 1
            })
            .slice(0, 6)
        )
      }
    },
  })

  return (
    <Container>
      <Title>閲覧履歴</Title>
      {histories.length ? (
        <Contents>
          {(() => {
            const itemsArray = []
            for (let n = 1; n <= histories.length; n += 1) {
              itemsArray.push(
                <div
                  key={histories[n - 1].id}
                  className={(() => {
                    if (histories.length === 1) {
                      return 'just-one-item item'
                    }
                    if (n === 1) {
                      return 'first-item item'
                    }
                    if (n === histories.length) {
                      return 'last-item item'
                    }
                    return 'item'
                  })()}
                >
                  {histories[n - 1].date}
                </div>
              )
            }
            return itemsArray
          })()}
        </Contents>
      ) : (
        <Contents>
          <div className="just-one-item item">閲覧履歴がありません。</div>
        </Contents>
      )}
      <LinkButton
        type="button"
        onClick={() => {
          history.push('/userHome/browsingHistoryCalendar')
        }}
      >
        全ての履歴を見る
      </LinkButton>
    </Container>
  )
}

const Container = styled.div`
  grid-area: browsingHistory;
  position: relative;
  &::before {
    content: '';
    background: #ddd;
    width: 1px;
    height: 570px;
    position: absolute;
    top: 60px;
    left: -50px;
  }
`

const Title = styled.div`
  font-size: 20px;
  margin-top: 60px;
`
const Contents = styled.div`
  margin-top: 40px;
  margin-left: 30px;
  width: 200px;
  .item {
    border: solid 1px #bab9b9;
    font-size: 14px;
    color: #5c5c5c;
    padding-left: 63px;
    padding-top: 20px;
    padding-bottom: 20px;
    margin: 0 0 -1px;
    &:hover {
      background: #f3f3f3;
    }
  }
  .first-item {
    border-radius: 5px 5px 0 0;
  }
  .last-item {
    border-radius: 0 0 5px 5px;
  }
  .just-one-item {
    border-radius: 5px;
    padding: 30px 0px;
    text-align: center;
  }
`

const LinkButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
  font-size: 14px;
  margin-top: 20px;
  margin-left: 30px;
  color: #5f5f5f;
  &:hover {
    color: #66c8ff;
    text-decoration: underline;
  }
`
