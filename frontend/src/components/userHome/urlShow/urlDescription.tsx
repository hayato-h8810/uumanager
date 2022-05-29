import { Rating, Button, ButtonGroup } from '@mui/material'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import { useParams, useHistory } from 'react-router-dom'
import {
  Url,
  useFetchFolderAndUrlQuery,
  useRecordBrowsingHistoryMutation,
  FetchBrowsingHistoryQuery,
  FetchBrowsingHistoryDocument,
} from '../../../api/graphql'
import EditUrlModal from '../editUrlModal'
import DeleteUrlDialog from '../deleteUrlDialog'

interface RouterParams {
  id: string
}

export default function UrlDescription() {
  const { id } = useParams<RouterParams>()
  const [selectedUrl, setSelectedUrl] = useState<Url | undefined>()
  const [folderName, setFolderName] = useState<string | null>()
  const [editUrlModalOpen, setEditUrlModalOpen] = useState(false)
  const [deleteUrlDialogOpen, setDeleteUrlDialogOpen] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const history = useHistory()
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      const specifiedUrl = fetchFolderAndUrl
        ?.map((folder) => folder.urls.find((url) => url.id === id))
        .find((urlsArray) => urlsArray)
      const attachedFolder = fetchFolderAndUrl
        ?.map((folder) => {
          if (folder.urls.find((url) => url.id === id)) {
            return folder.name
          }
          return null
        })
        .find((folder) => folder)
      setFolderName(attachedFolder)
      setSelectedUrl(specifiedUrl)
    },
  })
  const [recordBrowsingHistoryMutation] = useRecordBrowsingHistoryMutation({
    update(cache, { data }) {
      const newCache = data?.recordBrowsingHistory
      const existingCache: FetchBrowsingHistoryQuery | null = cache.readQuery({
        query: FetchBrowsingHistoryDocument,
      })
      if (existingCache?.fetchBrowsingHistory) {
        cache.writeQuery({
          query: FetchBrowsingHistoryDocument,
          data: { fetchBrowsingHistory: [...existingCache.fetchBrowsingHistory, newCache] },
        })
      } else {
        cache.writeQuery({
          query: FetchBrowsingHistoryDocument,
          data: { fetchBrowsingHistory: [newCache] },
        })
      }
    },
  })
  useEffect(() => {
    if (isDeleted) {
      setIsDeleted(false)
      history.push('/userHome')
    }
  }, [isDeleted])

  return (
    <>
      <Container>
        {selectedUrl && (
          <>
            <Headline>
              <div>登録情報</div>
              <ButtonGroupContainer>
                <ButtonGroup variant="outlined" size="small">
                  <Button
                    onClick={() => {
                      recordBrowsingHistoryMutation({
                        variables: { urlId: selectedUrl.id, date: format(new Date(), 'yyyy-MM-dd') },
                      })
                      window.open(selectedUrl.url, '_blank', 'noreferrer')
                    }}
                  >
                    リンク
                  </Button>
                  <Button onClick={() => setEditUrlModalOpen(true)}>編集</Button>
                  <Button onClick={() => setDeleteUrlDialogOpen(true)}>削除</Button>
                </ButtonGroup>
              </ButtonGroupContainer>
            </Headline>
            <Contents>
              <div className="item-container">
                <div className="label">タイトル</div>
                <div className="item">{selectedUrl.title ? selectedUrl.title : '記入なし。'}</div>
              </div>
              <div className="item-container">
                <div className="label">コメント</div>
                <div className="item">{selectedUrl.memo ? selectedUrl.memo : '記入なし。'}</div>
              </div>
              <div className="item-container">
                <div className="label">重要度</div>
                <Rating value={selectedUrl.importance} readOnly />
              </div>
              <div className="item-container">
                <div className="label">登録日</div>
                <div className="item">{format(new Date(selectedUrl.createdAt * 1000), 'yyyy-MM-dd')}</div>
              </div>
              <div className="item-container">
                <div className="label">通知日</div>
                <div className="item">{selectedUrl.notification ? selectedUrl.notification : '通知なし。'}</div>
              </div>
              <div className="item-container">
                <div className="label">フォルダー</div>
                <div className="item">{folderName}</div>
              </div>
              <div className="item-container">
                <div className="label">url</div>
                <div className="url-item">{selectedUrl.url}</div>
              </div>
            </Contents>
          </>
        )}
      </Container>
      <EditUrlModal props={{ editUrlModalOpen, setEditUrlModalOpen, urlId: id }} />
      <DeleteUrlDialog
        props={{
          deleteUrlDialogOpen,
          setDeleteUrlDialogOpen,
          deleteUrlId: selectedUrl?.id,
          setIsDeleted,
        }}
      />
    </>
  )
}

const Container = styled.div`
  grid-area: urlDescription;
  min-height: 714px;
  margin-left: 5px;
`

const Headline = styled.div`
  position: relative;
  margin-top: 65px;
  margin-left: 140px;
  font-size: 20px;
`

const ButtonGroupContainer = styled.div`
  position: absolute;
  left: 385px;
  bottom: -15px;
  .MuiButton-root {
    font-size: 14px;
    padding: 2px 10px;
    color: #39b8ff;
    &:hover {
      color: #39b8ff;
    }
  }
`

const Contents = styled.div`
  position: relative;
  padding-top: 50px;
  margin-left: 150px;
  margin-bottom: 85px;
  &::before {
    content: '';
    height: 1px;
    width: 640px;
    background: #b7b7b7;
    position: absolute;
    left: -60px;
    top: 25px;
  }
  .item-container {
    font-size: 14px;
    position: relative;
    &::before {
      content: '';
      width: 5px;
      height: 30px;
      position: absolute;
      top: 20px;
      left: 10px;
      background: #1cdcae;
    }
    .label {
      position: absolute;
      top: 23px;
      left: 55px;
      color: #222;
    }
    .item {
      display: inline-block;
      max-width: 240px;
      margin-left: 300px;
      padding-top: 23px;
      padding-bottom: 23px;
      overflow-wrap: break-word;
      color: #222;
    }
    .url-item {
      display: inline-block;
      max-width: 240px;
      margin-left: 300px;
      padding-top: 23px;
      overflow: auto;
      white-space: nowrap;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      color: #5c5c5c;
      &::before {
        content: '';
        height: 1px;
        width: 640px;
        background: #b7b7b7;
        position: absolute;
        left: -60px;
        top: 100px;
      }
    }
    .MuiRating-root {
      margin-top: 21px;
      margin-bottom: 21px;
      margin-left: 300px;
    }
  }
`
