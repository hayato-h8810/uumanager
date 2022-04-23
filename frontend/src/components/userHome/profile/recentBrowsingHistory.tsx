import { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useFetchBrowsingHistoryQuery, useFetchFolderAndUrlQuery } from '../../../api/graphql'

export default function RecentBrowsingHistory() {
  const [hoveredId, setHoveredId] = useState('')
  const history = useHistory()
  const location = useLocation()
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
  })
  const { data: { fetchBrowsingHistory = null } = {} } = useFetchBrowsingHistoryQuery({
    fetchPolicy: 'network-only',
    skip: !fetchFolderAndUrl,
  })

  const recentHistory = () => {
    const histories: { id: string; browsingDate: string; title: string; urlId: string }[] = []
    fetchBrowsingHistory?.forEach((data) => {
      fetchFolderAndUrl?.forEach((folder) =>
        folder.urls.forEach((url) => {
          if (url.id === data.urlId) {
            histories.push({
              id: data.id,
              browsingDate: data.date,
              title: url.title ? url.title : 'no title',
              urlId: data.urlId,
            })
          }
        })
      )
    })
    return histories
      .sort((a, b) => {
        if (a?.browsingDate && b?.browsingDate) {
          return a?.browsingDate < b?.browsingDate ? 1 : -1
        }
        return 1
      })
      .slice(0, 6)
  }

  return (
    <Container>
      <Title>最近の閲覧履歴</Title>
      <Contents>
        {(() => {
          if (recentHistory().length) {
            return recentHistory().map((historyData) => (
              <div
                key={historyData.id}
                className={hoveredId === historyData.id ? 'hovered-item item' : 'item'}
                onMouseEnter={() => setHoveredId(historyData.id)}
              >
                <div key={`date-${historyData.id}`} className="date-value">
                  {historyData.browsingDate}
                </div>
                <button
                  type="button"
                  key={`title-${historyData.id}`}
                  onClick={() => {
                    history.push({
                      pathname: `/userHome/urlShow/${historyData.urlId}`,
                      state: { prevPathname: location.pathname },
                    })
                  }}
                  className="title-value"
                >
                  {historyData.title}
                </button>
              </div>
            ))
          }
          return <div className="no-browsing-history">閲覧履歴がありません</div>
        })()}
      </Contents>
      {fetchBrowsingHistory && fetchBrowsingHistory?.length > 6 && (
        <ShowMoreButton href="/userHome/browsingHistory">もっと見る</ShowMoreButton>
      )}
    </Container>
  )
}

const Container = styled.div`
  grid-area: recentBrowsingHistory;
  position: relative;
  &::before {
    background: #bdbdbd;
    content: '';
    position: absolute;
    width: 1px;
    height: 550px;
    top: 30px;
    left: -40px;
  }
`

const Title = styled.h1`
  padding-top: 40px;
  padding-left: 20px;
  font-weight: normal;
  font-size: 20px;
`

const Contents = styled.div`
  border-top: solid 1px #bab9b9;
  margin-top: 30px;
  margin-left: 50px;
  margin-bottom: 10px;
  width: 350px;
  .item {
    border-bottom: solid 1px #bab9b9;
    height: 65px;
    position: relative;
  }
  .hovered-item {
    background: #f8f8f8;
  }
  .date-value {
    position: absolute;
    top: 5px;
    left: 30px;
    font-size: 12px;
    color: #5f5f5f;
  }
  .title-value {
    position: absolute;
    top: 30px;
    left: 60px;
    font-size: 15px;
    max-width: 280px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: blue;
      text-decoration: underline;
    }
  }
  .no-browsing-history {
    font-size: 11px;
    color: #5f5f5f;
    margin-top: 15px;
    margin-left: 20px;
  }
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
  }
`

const ShowMoreButton = styled.a`
  margin-left: 50px;
  text-decoration: none;
  color: inherit;
  font-size: 11px;
  color: #5f5f5f;
  &:hover {
    color: blue;
    text-decoration: underline;
  }
`
