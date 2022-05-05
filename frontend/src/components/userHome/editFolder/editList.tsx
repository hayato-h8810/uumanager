import {
  TextField,
  Button,
  Pagination,
  Select,
  MenuItem,
  ButtonGroup,
  IconButton,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import {
  useFetchFolderAndUrlQuery,
  useEditFolderMutation,
  useDeleteFolderMutation,
  Folder,
  FetchFolderAndUrlQuery,
  FetchFolderAndUrlDocument,
} from '../../../api/graphql'

export default function EditList() {
  const [selectedFolder, setSelectedFolder] = useState('')
  const [editFolderNameValue, setEditFolderNameValue] = useState('')
  const [errorValue, setErrorValue] = useState<string | null>()
  const [filterValue, setFilterValue] = useState('')
  const [sortRule, setSortRule] = useState('new')
  const [folderFullLength, setFolderFullLength] = useState(0)
  const [page, setPage] = useState(1)
  const [displayFolder, setDisplayFolder] = useState<Folder[]>([])
  const [deleteFolderDialogOpen, setDeleteFolderDialogOpen] = useState(false)
  const history = useHistory()
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (fetchFolderAndUrl) {
        setFolderFullLength(fetchFolderAndUrl?.length)
      } else {
        setDisplayFolder([])
      }
    },
  })
  const [editFolderMutation] = useEditFolderMutation({
    onCompleted: () => setSelectedFolder(''),
  })
  const [deleteFolderMutation] = useDeleteFolderMutation({
    onCompleted: () => {
      setDeleteFolderDialogOpen(false)
      setSelectedFolder('')
    },
    update(cache, { data }) {
      const existingCache: FetchFolderAndUrlQuery | null = cache.readQuery({
        query: FetchFolderAndUrlDocument,
      })
      if (existingCache?.fetchFolderAndUrl) {
        const newCache = existingCache?.fetchFolderAndUrl.filter((folder) => folder.id !== data?.deleteFolder?.id)
        cache.writeQuery({
          query: FetchFolderAndUrlDocument,
          data: { fetchFolderAndUrl: newCache },
        })
      }
    },
  })

  useEffect(() => {
    if (fetchFolderAndUrl) {
      const sortedArray = [...fetchFolderAndUrl]
      if (sortRule === 'new') {
        sortedArray.sort((a, b) => Number(b.id) - Number(a.id))
      } else if (sortRule === 'old') {
        sortedArray.sort((a, b) => Number(a.id) - Number(b.id))
      } else if (sortRule === 'alphabet') {
        sortedArray.sort((a, b) => (a.name > b.name ? 1 : -1))
      }
      if (filterValue) {
        setDisplayFolder(
          sortedArray.filter((folder) => folder.name.match(filterValue)).slice((page - 1) * 7, (page - 1) * 7 + 7)
        )
        setFolderFullLength(sortedArray.filter((folder) => folder.name.match(filterValue)).length)
      } else {
        setDisplayFolder(sortedArray.slice((page - 1) * 7, (page - 1) * 7 + 7))
        setFolderFullLength(sortedArray.length)
      }
    }
  }, [fetchFolderAndUrl, page, filterValue, sortRule])

  useEffect(() => {
    if (page > Math.ceil(folderFullLength / 7)) {
      setPage(1)
    }
  }, [folderFullLength])

  return (
    <>
      <Container>
        <BackButton>
          <IconButton onClick={() => history.goBack()}>
            <ArrowBackIcon />
          </IconButton>
        </BackButton>
        <Title>フォルダーの編集&削除</Title>
        <Filter>
          <TextField
            value={filterValue}
            onChange={(e) => {
              setFilterValue(e.target.value)
              setSelectedFolder('')
              setErrorValue('')
            }}
            variant="outlined"
            placeholder="フォルダーを探す..."
          />
        </Filter>
        <Sort>
          <Select
            value={sortRule}
            onChange={(e) => {
              setSortRule(e.target.value)
              setSelectedFolder('')
              setErrorValue('')
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  '& .MuiMenuItem-root': {
                    fontSize: '12px',
                  },
                },
              },
            }}
          >
            <MenuItem value="new">新しい順</MenuItem>
            <MenuItem value="old">古い順</MenuItem>
            <MenuItem value="alphabet">五十音順</MenuItem>
          </Select>
        </Sort>
        <Contents>
          <div className="folder-list">
            {(() => {
              if (displayFolder && displayFolder.length) {
                return displayFolder.map((folder, i) => {
                  if (selectedFolder !== folder.id) {
                    return (
                      <div
                        className={`item-container ${i === 0 ? 'first-item-container' : ''}`}
                        role="button"
                        tabIndex={0}
                        key={folder.id}
                        onClick={() => {
                          setSelectedFolder(folder.id)
                          setEditFolderNameValue(folder.name)
                          setErrorValue('')
                        }}
                      >
                        <CheckBoxOutlineBlankIcon />
                        <div key={folder.id} className="item">
                          {folder.name}
                        </div>
                      </div>
                    )
                  }
                  return (
                    <div
                      className={`item-container selected-item-container
                      ${i === 0 ? 'first-item-container' : ''}
                    `}
                      key={folder.id}
                    >
                      <CheckBoxIcon onClick={() => setSelectedFolder('')} />
                      <TextField
                        value={editFolderNameValue}
                        onChange={(e) => setEditFolderNameValue(e.target.value)}
                        label="フォルダー名"
                        variant="standard"
                      />
                      {errorValue && <div className="error-value">{errorValue}</div>}
                      <ButtonGroup variant="outlined">
                        <Button onClick={() => setDeleteFolderDialogOpen(true)}>削除</Button>
                        <Button
                          onClick={() => {
                            if (!editFolderNameValue) {
                              setErrorValue('フォルダー名を入力して下さい。')
                            } else if (editFolderNameValue !== folder.name) {
                              editFolderMutation({
                                variables: { folderId: folder.id, folderName: editFolderNameValue },
                              })
                            }
                          }}
                        >
                          決定
                        </Button>
                      </ButtonGroup>
                    </div>
                  )
                })
              }
              return (
                <div className="no-item-container">
                  <div className="item">フォルダーがありません。</div>
                </div>
              )
            })()}
          </div>
        </Contents>
        <PaginationContainer>
          {folderFullLength > 7 && (
            <Pagination
              count={Math.ceil(folderFullLength / 7)}
              onChange={(_, Currentpage) => {
                setPage(Currentpage)
                setSelectedFolder('')
                setErrorValue('')
              }}
              page={page}
            />
          )}
        </PaginationContainer>
      </Container>
      <DialogContainer open={deleteFolderDialogOpen}>
        <DialogTitle>フォルダーの削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            フォルダーを削除するとフォルダー内にあるurlも削除されます。本当に削除しますか?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFolderDialogOpen(false)}>削除しない</Button>
          <Button onClick={() => deleteFolderMutation({ variables: { folderId: selectedFolder } })} autoFocus>
            削除する
          </Button>
        </DialogActions>
      </DialogContainer>
    </>
  )
}

const Container = styled.div`
  grid-area: editList;
  position: relative;
  &::before {
    content: '';
    width: 1px;
    height: 550px;
    position: absolute;
    background: #b7b7b7;
    top: 60px;
    left: 460px;
  }
`

const BackButton = styled.div`
  position: absolute;
  top: 5px;
  left: 20px;
`

const Title = styled.div`
  margin-top: 45px;
  margin-left: 120px;
  font-size: 20px;
  position: relative;
`

const Filter = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 120px;
  margin-top: 40px;
  .MuiInputBase-root {
    margin-top: 2px;
    .MuiInputBase-input {
      width: 129px;
      font-size: 14px;
      padding: 6px 10px;
    }
  }
`

const Sort = styled.div`
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
  margin-top: 42px;
  .MuiInputBase-root .MuiSelect-select {
    font-size: 14px;
    padding-top: 4.5px;
    padding-bottom: 4.5px;
    padding-left: 10px;
  }
`

const Contents = styled.div`
  min-height: 402px;
  margin-top: 20px;
  margin-left: 120px;
  .folder-list {
    width: 257px;
    border: solid 1px #b7b7b7;
    border-radius: 5px;
    overflow: hidden;
  }
  .item-container {
    height: 50px;
    position: relative;
    &::before {
      content: '';
      background: #b7b7b7;
      width: 257px;
      height: 1px;
      position: absolute;
      left: 0;
    }
    &:hover {
      background: #f8f8f8;
    }
    .MuiSvgIcon-root {
      position: absolute;
      top: 16px;
      left: 25px;
      font-size: 18px;
      color: #454545;
      cursor: pointer;
    }
  }
  .selected-item-container {
    height: auto;
    min-height: 90px;
    .error-value {
      margin-left: 46px;
      color: red;
      font-size: 10px;
      transform: scale(0.8);
    }
    .MuiTextField-root {
      margin-left: 70px;
      margin-top: 10px;
      width: 140px;
      .MuiInput-root {
        margin-top: 9px;
        font-size: 14px;
      }
      .MuiInputLabel-root {
        font-size: 14px;
        top: -7px;
      }
      .MuiInputLabel-shrink {
        top: -2px;
        font-size: 12px;
      }
    }
    .MuiButton-root {
      margin-left: 145px;
      font-size: 12px;
      margin-top: 15px;
      margin-bottom: 15px;
      padding: 2px 10px;
    }
    .MuiSvgIcon-root {
      color: #2395ff;
      font-size: 18px;
      &:hover {
        color: #1086f3;
      }
    }
  }
  .no-item-container {
    height: 45px;
    .item {
      text-align: center;
      color: #848484;
      font-size: 10px;
      margin: auto;
    }
  }
  .first-item-container {
    &::before {
      content: none;
    }
  }
  .item {
    margin-left: 70px;
    width: 138px;
    padding-top: 15px;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    font-size: 14px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const PaginationContainer = styled.div`
  margin-top: 20px;
  margin-left: 165px;
  .MuiButtonBase-root {
    font-size: 14px;
    min-width: 30px;
    height: 30px;
  }
  .MuiSvgIcon-root {
    font-size: 25px;
  }
`

const DialogContainer = styled(Dialog)`
  & .MuiPaper-root {
    background: #2f2f2f;
    color: white;
    & .MuiDialogContentText-root {
      color: white;
    }
  }
`
