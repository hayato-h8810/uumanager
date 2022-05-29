import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { IconButton, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Url, useFetchFolderAndUrlQuery, useTransferMultipleUrlsMutation } from '../../../api/graphql'
import TransferList from './transferList'

export default function BatchTransfer() {
  const [urlListOfA, setUrlListOfA] = useState<Url[] | null>()
  const [urlListOfB, setUrlListOfB] = useState<Url[] | null>()
  const [selectFolderIdInListOfA, setSelectFolderIdInListOfA] = useState('')
  const [selectFolderIdInListOfB, setSelectFolderIdInListOfB] = useState('')
  const [selectUrlInListOfA, setSelectUrlInListOfA] = useState<Url[] | null>()
  const [selectUrlInListOfB, setSelectUrlInListOfB] = useState<Url[] | null>()
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    onCompleted: () => {
      if (selectFolderIdInListOfA && !fetchFolderAndUrl?.find((folder) => folder.id === selectFolderIdInListOfA)) {
        setSelectFolderIdInListOfA('')
      }
      if (selectFolderIdInListOfB && !fetchFolderAndUrl?.find((folder) => folder.id === selectFolderIdInListOfB)) {
        setSelectFolderIdInListOfB('')
      }
    },
    fetchPolicy: 'network-only',
  })
  const [transferMultipleUrlsMutation] = useTransferMultipleUrlsMutation()

  const detectSelectedFolder = (folderId: string) => {
    if (fetchFolderAndUrl) {
      return fetchFolderAndUrl.find((folder) => folder.id === folderId)?.urls
    }
    return null
  }

  useEffect(() => {
    setUrlListOfA(detectSelectedFolder(selectFolderIdInListOfA))
    setUrlListOfB(detectSelectedFolder(selectFolderIdInListOfB))
    setSelectUrlInListOfA(null)
    setSelectUrlInListOfB(null)
  }, [selectFolderIdInListOfA, selectFolderIdInListOfB])

  const isEqualArray = (arrayA: Url[] | null | undefined, arrayB: Url[] | null | undefined) => {
    if (arrayA?.length !== arrayB?.length) {
      return false
    }
    if (
      arrayA?.map((itemA) => arrayB?.find((itemB) => itemB.id === itemA.id)).filter((item) => item === undefined)
        .length &&
      arrayA?.map((itemA) => arrayB?.find((itemB) => itemB.id === itemA.id)).filter((item) => item === undefined)[0] ===
        undefined
    ) {
      return false
    }
    return true
  }

  return (
    <Container>
      <Headline>
        <Title>url一括移動</Title>
        <ResetButton>
          <Button
            onClick={() => {
              setUrlListOfA(detectSelectedFolder(selectFolderIdInListOfA))
              setUrlListOfB(detectSelectedFolder(selectFolderIdInListOfB))
              setSelectUrlInListOfA(null)
              setSelectUrlInListOfB(null)
            }}
            variant="outlined"
          >
            リセット
          </Button>
        </ResetButton>
        <ConfirmButton>
          <Button
            onClick={() =>
              transferMultipleUrlsMutation({
                variables: {
                  folderAndUrlId: [
                    { folderId: selectFolderIdInListOfA, urlId: urlListOfA?.map((url) => url.id) },
                    { folderId: selectFolderIdInListOfB, urlId: urlListOfB?.map((url) => url.id) },
                  ],
                },
              })
            }
            disabled={
              !(
                selectFolderIdInListOfA &&
                selectFolderIdInListOfB &&
                !isEqualArray(
                  fetchFolderAndUrl?.find((folder) => folder.id === selectFolderIdInListOfA)?.urls,
                  urlListOfA
                )
              )
            }
            variant="contained"
          >
            確定
          </Button>
        </ConfirmButton>
      </Headline>
      <TransferLists>
        <ListOfA>
          <TransferList
            props={{
              urlList: urlListOfA,
              setUrlList: setUrlListOfA,
              selectFolderId: selectFolderIdInListOfA,
              setSelectFolderId: setSelectFolderIdInListOfA,
              selectFolderIdInTheOtherSide: selectFolderIdInListOfB,
              selectUrl: selectUrlInListOfA,
              setSelectUrl: setSelectUrlInListOfA,
            }}
          />
        </ListOfA>
        <TransferIcon>
          <IconButton
            onClick={() => {
              if (selectUrlInListOfA) {
                setUrlListOfB((urlList) => (urlList ? [...urlList, ...selectUrlInListOfA] : selectUrlInListOfA))
                setUrlListOfA((urlList) =>
                  urlList?.filter((url) => !selectUrlInListOfA.find((urlInA) => urlInA === url))
                )
                setSelectUrlInListOfA(null)
              }
            }}
            disabled={!(selectFolderIdInListOfA && selectFolderIdInListOfB && selectUrlInListOfA?.length)}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          <br />
          <IconButton
            onClick={() => {
              if (selectUrlInListOfB) {
                setUrlListOfA((urlList) => (urlList ? [...urlList, ...selectUrlInListOfB] : selectUrlInListOfB))
                setUrlListOfB((urlList) =>
                  urlList?.filter((url) => !selectUrlInListOfB.find((urlInB) => urlInB === url))
                )
                setSelectUrlInListOfB(null)
              }
            }}
            disabled={!(selectFolderIdInListOfA && selectFolderIdInListOfB && selectUrlInListOfB?.length)}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
        </TransferIcon>
        <ListOfB>
          <TransferList
            props={{
              urlList: urlListOfB,
              setUrlList: setUrlListOfB,
              selectFolderId: selectFolderIdInListOfB,
              setSelectFolderId: setSelectFolderIdInListOfB,
              selectFolderIdInTheOtherSide: selectFolderIdInListOfA,
              selectUrl: selectUrlInListOfB,
              setSelectUrl: setSelectUrlInListOfB,
            }}
          />
        </ListOfB>
      </TransferLists>
    </Container>
  )
}

const Container = styled.div`
  grid-area: batchTransfer;
`

const Headline = styled.div`
  margin-left: 85px;
  margin-top: 60px;
`

const Title = styled.div`
  display: inline-block;
  font-size: 20px;
`

const ResetButton = styled.div`
  display: inline-block;
  margin-left: 430px;
  .MuiButton-root {
    color: black;
    border-color: #b4b4b4;
    font-size: 14px;
    padding: 2px 10px;
    min-width: 47px;
    &:hover {
      box-shadow: none;
      border-color: #595959;
      background: #f8f8f8;
    }
  }
`

const ConfirmButton = styled.div`
  display: inline-block;
  margin-left: 38px;
  .MuiButton-root {
    background: #18ac00;
    font-size: 14px;
    padding: 2px 12px;
    box-shadow: none;
    min-width: 47px;
    &:hover {
      background: #2d8d00;
      box-shadow: none;
    }
    &:disabled {
      background: #94d3a2;
      color: white;
    }
  }
`

const TransferLists = styled.div`
  margin-left: 85px;
  margin-top: 30px;
`

const ListOfA = styled.div`
  display: inline-block;
`

const ListOfB = styled.div`
  display: inline-block;
`

const TransferIcon = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-top: 214px;
  margin-left: 25px;
  margin-right: 25px;
  .MuiButtonBase-root {
    margin-top: 30px;
    border: 1px solid #2c9aff;
    border-radius: 7px;
    padding: 3px 15px;
    .MuiSvgIcon-root {
      font-size: 20px;
      color: #2c9aff;
    }
    &:hover {
      background-color: #f8f8f8;
      border-color: #0f6fff;
      .MuiSvgIcon-root {
        color: #0f6fff;
      }
    }
    &:disabled {
      border-color: #b1b1b1;
      .MuiSvgIcon-root {
        color: #b1b1b1;
      }
    }
  }
`
