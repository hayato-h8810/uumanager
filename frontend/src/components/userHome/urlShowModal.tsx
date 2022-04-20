import { Modal, IconButton, Rating, Button, ButtonGroup } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import { useHistory, useLocation } from 'react-router-dom'
import { Url, useFetchFolderAndUrlQuery } from '../../api/graphql'

interface propsType {
  selectedId: string
  urlShowModalOpen: boolean
  setUrlShowModalOpen: (boolean: boolean) => void
}

export default function UrlShowModal({ props }: { props: propsType }) {
  const { selectedId, urlShowModalOpen, setUrlShowModalOpen } = props
  const [selectedUrl, setSelectedUrl] = useState<Url | undefined>()
  const [folderName, setFolderName] = useState<string | null>()
  const history = useHistory()
  const location = useLocation()
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    const specifiedUrl = fetchFolderAndUrl
      ?.map((folder) => folder.urls.find((url) => url.id === selectedId))
      .find((urlsArray) => urlsArray)
    const attachedFolder = fetchFolderAndUrl
      ?.map((folder) => {
        if (folder.urls.find((url) => url.id === selectedId)) {
          return folder.name
        }
        return null
      })
      .find((folder) => folder)
    setFolderName(attachedFolder)
    setSelectedUrl(specifiedUrl)
  }, [urlShowModalOpen])

  return (
    <Modal
      open={urlShowModalOpen}
      onBackdropClick={() => {
        setUrlShowModalOpen(false)
        setSelectedUrl(undefined)
      }}
    >
      <Container>
        {selectedUrl && (
          <>
            <Headline>
              {!location.pathname.startsWith('/userHome/listOfFolderAndUrl') && (
                <GoToListButton
                  type="button"
                  onClick={() =>
                    history.push({ pathname: '/userHome/listOfFolderAndUrl', state: { from: selectedId } })
                  }
                >
                  <div className="text">一覧へ</div>
                  <ArrowForwardIosIcon />
                </GoToListButton>
              )}
              <CloseIcon>
                <IconButton
                  onClick={() => {
                    setUrlShowModalOpen(false)
                    setSelectedUrl(undefined)
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </CloseIcon>
              <Title>
                <div className="title-value">{selectedUrl.title}</div>
                <div className="rating-container">
                  <Rating value={selectedUrl.importance} readOnly />
                </div>
              </Title>
              <DeleteAndEditButton>
                <ButtonGroup variant="outlined" size="small">
                  <Button>削除</Button>
                  <Button>編集</Button>
                </ButtonGroup>
              </DeleteAndEditButton>
            </Headline>
            <Contents>
              <div className="items">
                <div className="item-container">
                  <div className="label">コメント</div>
                  <div className="item">{selectedUrl.memo ? selectedUrl.memo : '記入なし。'}</div>
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
              </div>
            </Contents>
            <Footer>
              <div className="link-button-container">
                <Button variant="contained">link</Button>
              </div>
            </Footer>
          </>
        )}
      </Container>
    </Modal>
  )
}

const Container = styled.div`
  max-height: 100%;
  max-width: 100%;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 680px;
  height: 620px;
  background: white;
  overflow: auto;
`

const Headline = styled.div`
  position: relative;
  min-height: 140px;
  width: 680px;
  margin-bottom: 10px;
`
const GoToListButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
  position: relative;
  margin-top: 30px;
  margin-left: 570px;
  color: #a8a8a8;
  &:hover {
    color: #39acff;
    .MuiSvgIcon-root {
      color: #39acff;
    }
  }
  .text {
    position: absolute;
    width: 40px;
    top: 2px;
    left: -10px;
  }
  .MuiSvgIcon-root {
    padding-left: 40px;
    font-size: 20px;
    color: #a8a8a8;
  }
`
const Title = styled.div`
  margin-left: 90px;
  margin-top: 10px;
  .title-value {
    font-size: 23px;
    position: relative;
    max-width: 500px;
    display: inline-block;
    overflow-wrap: break-word;
    &::before {
      background: #bdbdbd;
      content: '';
      position: absolute;
      width: 190px;
      height: 1px;
      bottom: -1px;
    }
  }
  .MuiRating-root {
    margin-left: 30px;
    margin-top: 10px;
  }
`

const CloseIcon = styled.div`
  position: absolute;
  left: 35px;
  top: 15px;
  .MuiSvgIcon-root {
    font-size: 30px;
    color: #b7b7b7;
  }
`

const DeleteAndEditButton = styled.div`
  position: absolute;
  left: 480px;
  bottom: 1px;
  .MuiButton-root {
    font-size: 12px;
    padding: 4px 11px;
    color: #39b8ff;
    &:hover {
      color: #39b8ff;
    }
  }
`

const Contents = styled.div`
  width: 680px;
  position: relative;
  &::before {
    content: '';
    height: 1px;
    width: 550px;
    background: #b7b7b7;
    position: absolute;
    left: 60px;
    top: 5px;
  }
  .items {
    padding-top: 20px;
    padding-bottom: 60px;
    width: 500px;
    margin-left: 120px;
    .item-container {
      min-height: 65px;
      font-size: 13px;
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
      }
      .item {
        display: inline-block;
        max-width: 200px;
        margin-left: 230px;
        padding-top: 23px;
        padding-bottom: 23px;
        overflow-wrap: break-word;
        color: #5c5c5c;
      }
      .url-item {
        display: inline-block;
        max-width: 200px;
        margin-left: 230px;
        padding-top: 23px;
        overflow: auto;
        white-space: nowrap;
        color: #5c5c5c;
      }
    }
  }
`

const Footer = styled.div`
  width: 680px;
  height: 55px;
  position: relative;
  &::after {
    content: '';
    height: 1px;
    width: 550px;
    background: #b7b7b7;
    position: absolute;
    left: 60px;
    top: -30px;
  }
  .link-button-container {
    position: absolute;
    left: 320px;
    .MuiButton-root {
      font-size: 12px;
      padding: 5px 13px;
      min-width: auto;
      background: #39acff;
    }
  }
`
