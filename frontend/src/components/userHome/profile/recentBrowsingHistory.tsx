import { useState } from 'react'
import styled from 'styled-components'
import { useFetchBrowsingHistoryQuery, useFetchFolderUrlQuery } from '../../../api/graphql'

export default function RecentBrowsingHistory() {
  const [selectedId, setSelectedId] = useState('')
  const [hoveredId, setHoveredId] = useState('')
  const { data: { fetchFolderUrl = null } = {} } = useFetchFolderUrlQuery({
    fetchPolicy: 'network-only',
  })
  const { data: { fetchBrowsingHistory = null } = {} } = useFetchBrowsingHistoryQuery({
    fetchPolicy: 'network-only',
    skip: !fetchFolderUrl,
  })

  const recentHistory = () => {
    const histories: { id: string; browsingDate: string; title: string; urlId: string }[] = []
    fetchBrowsingHistory?.forEach((data) => {
      fetchFolderUrl?.forEach((folder) =>
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
    <Item>
      <Title>最近の閲覧履歴</Title>
      <BrowsingHistoryContainer>
        {(() => {
          if (recentHistory().length) {
            return recentHistory().map((historyData) => (
              <div
                key={historyData.id}
                className={hoveredId === historyData.id ? 'hoveredItem item' : 'item'}
                onMouseEnter={() => setHoveredId(historyData.id)}
              >
                <div key={`date-${historyData.id}`} className="dateValue">
                  {historyData.browsingDate}
                </div>
                <button
                  type="button"
                  key={`title-${historyData.id}`}
                  onClick={() => {
                    setSelectedId(historyData.urlId)
                  }}
                  className="titleValue"
                >
                  {historyData.title}
                </button>
              </div>
            ))
          }
          return <div className="no-browsing-history">閲覧履歴がありません</div>
        })()}
      </BrowsingHistoryContainer>
      {fetchBrowsingHistory && fetchBrowsingHistory?.length > 6 && (
        <ShowMoreButton href="/userHome/calendar">もっと見る</ShowMoreButton>
      )}
    </Item>
  )
}

const Item = styled.div`
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
  padding-top: 50px;
  padding-left: 20px;
  font-weight: normal;
  font-size: 20px;
`

const BrowsingHistoryContainer = styled.div`
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
  .hoveredItem {
    background: #f8f8f8;
  }
  .dateValue {
    position: absolute;
    top: 5px;
    left: 60px;
    font-size: 12px;
    color: #5f5f5f;
  }
  .titleValue {
    position: absolute;
    top: 30px;
    left: 90px;
    font-size: 15px;
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
