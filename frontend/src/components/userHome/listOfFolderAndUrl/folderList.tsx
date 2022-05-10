import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { TextField, Button, Select, MenuItem, ClickAwayListener, Pagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import {
  useFetchFolderAndUrlQuery,
  useAddFolderMutation,
  FetchFolderAndUrlDocument,
  FetchFolderAndUrlQuery,
  Folder,
  Url,
} from '../../../api/graphql'

interface propsType {
  selectUrlArray: Url[] | null | undefined
  setSelectUrlArray: (urls: Url[] | null) => void
}

export default function ShowFolderList({ props }: { props: propsType }) {
  const { selectUrlArray, setSelectUrlArray } = props
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortRule, setSortRule] = useState('new')
  const [displayFolders, setDisplayFolders] = useState<Folder[] | null>(null)
  const [addFormInputtable, setAddFormInputtable] = useState(false)
  const [addFormValue, setAddFormValue] = useState('')
  const [page, setPage] = useState(1)
  const [folderFullLength, setFolderFullLength] = useState(0)
  const history = useHistory()
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.fetchFolderAndUrl && !selectUrlArray) {
        const folders = [...data.fetchFolderAndUrl]
        setSelectedFolderId(folders.sort((a, b) => Number(b.id) - Number(a.id))[0].id)
      }
    },
  })
  const [addFolderMutation] = useAddFolderMutation({
    update(cache, { data }) {
      const newCache = data?.addFolder
      const existingCache: FetchFolderAndUrlQuery | null = cache.readQuery({
        query: FetchFolderAndUrlDocument,
      })
      if (existingCache?.fetchFolderAndUrl) {
        cache.writeQuery({
          query: FetchFolderAndUrlDocument,
          data: { fetchFolderAndUrl: [...existingCache.fetchFolderAndUrl, newCache] },
        })
      } else {
        cache.writeQuery({
          query: FetchFolderAndUrlDocument,
          data: { fetchFolderAndUrl: [newCache] },
        })
      }
    },
    onCompleted: () => {
      setAddFormInputtable(false)
      setAddFormValue('')
    },
  })
  useEffect(() => {
    const selectedUrls = fetchFolderAndUrl?.find((folder) => folder.id === selectedFolderId)?.urls
    if (selectedUrls) {
      setSelectUrlArray(selectedUrls)
    }
  }, [selectedFolderId, fetchFolderAndUrl])

  useEffect(() => {
    if (fetchFolderAndUrl) {
      const sortedArray = [...fetchFolderAndUrl]
      let filterdArray: Folder[] | null = []
      if (sortRule === 'new') {
        sortedArray.sort((a, b) => Number(b.id) - Number(a.id))
      } else if (sortRule === 'old') {
        sortedArray.sort((a, b) => Number(a.id) - Number(b.id))
      } else if (sortRule === 'alphabet') {
        sortedArray.sort((a, b) => (a.name > b.name ? 1 : -1))
      }
      if (filterValue) {
        filterdArray = sortedArray.filter((folder) => folder.name.indexOf(filterValue) !== -1)
      } else {
        filterdArray = sortedArray
      }
      setFolderFullLength(filterdArray.length)
      setDisplayFolders(filterdArray.slice((page - 1) * 7, (page - 1) * 7 + 7))
    }
  }, [fetchFolderAndUrl, filterValue, sortRule, page])
  useEffect(() => {
    if (page > Math.ceil(folderFullLength / 7)) {
      setPage(1)
    }
  }, [folderFullLength])

  return (
    <Container>
      <Title>フォルダー</Title>
      <EditButton>
        <Button onClick={() => history.push('/userHome/editFolder')} variant="text">
          編集
        </Button>
      </EditButton>
      <Filter>
        <TextField
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          variant="outlined"
          placeholder="フォルダーを探す..."
        />
      </Filter>
      <Sort>
        <Select
          value={sortRule}
          onChange={(e) => {
            setSortRule(e.target.value)
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
        {(() => {
          if (displayFolders) {
            if (!displayFolders.length) {
              return (
                <div className="no-item-container">
                  <div className="no-item">フォルダーが見つかりません。</div>
                </div>
              )
            }
            return displayFolders.map((folder) => (
              <div
                className={selectedFolderId === folder.id ? 'item-container selected-item-container' : 'item-container'}
                role="button"
                tabIndex={0}
                key={folder.id}
                onClick={() => {
                  setSelectedFolderId(folder.id)
                }}
              >
                <div key={folder.id} className="folder-item">
                  {folder.name}
                </div>
              </div>
            ))
          }
          return (
            <div className="no-item-container">
              <div className="no-item">フォルダーがありません。</div>
            </div>
          )
        })()}
      </Contents>
      <AddFolderForm>
        {addFormInputtable ? (
          <ClickAwayListener
            onClickAway={() => {
              setAddFormInputtable(false)
              setAddFormValue('')
            }}
          >
            <div className="add-form-input">
              <TextField
                value={addFormValue}
                onChange={(e) => setAddFormValue(e.target.value)}
                placeholder="新しくフォルダーを追加..."
              />
              <br />
              <Button
                onClick={() => {
                  setAddFormInputtable(false)
                  setAddFormValue('')
                }}
                variant="outlined"
                className="cancel-button"
              >
                キャンセル
              </Button>
              <Button
                disabled={!addFormValue}
                onClick={() => addFolderMutation({ variables: { folderName: addFormValue } })}
                variant="contained"
                className="add-button"
              >
                追加する
              </Button>
            </div>
          </ClickAwayListener>
        ) : (
          <div onClick={() => setAddFormInputtable(true)} className="add-form-button" role="button" tabIndex={0}>
            <div className="add-icon-container">
              <AddIcon />
            </div>
            <div className="value">新しくフォルダーを追加...</div>
          </div>
        )}
      </AddFolderForm>
      <PaginationContainer>
        {folderFullLength > 7 && (
          <Pagination
            count={Math.ceil(folderFullLength / 7)}
            onChange={(_, Currentpage) => {
              setPage(Currentpage)
            }}
            page={page}
          />
        )}
      </PaginationContainer>
    </Container>
  )
}

const Container = styled.div`
  grid-area: folderList;
  position: relative;
  &::before {
    content: '';
    width: 1px;
    height: 530px;
    position: absolute;
    background: #b7b7b7;
    top: 40px;
    left: 460px;
  }
`

const Title = styled.div`
  margin-top: 50px;
  margin-left: 110px;
  font-size: 20px;
  margin-bottom: 10px;
`

const EditButton = styled.div`
  top: 55px;
  left: 334px;
  position: absolute;
  .MuiButton-root {
    font-size: 14px;
    padding: 4px 10px;
  }
`

const Filter = styled.div`
  display: inline-block;
  margin-left: 90px;
  .MuiInputBase-root .MuiInputBase-input {
    width: 180px;
    font-size: 14px;
    padding: 6px 10px;
  }
`

const Sort = styled.div`
  display: inline-block;
  margin-left: 10px;
  vertical-align: top;
  .MuiInputBase-root {
    height: 32px;
    .MuiSelect-select {
      font-size: 14px;
      padding: 4px;
      padding-left: 10px;
      color: #8a8a8a;
    }
  }
`

const Contents = styled.div`
  margin-top: 11px;
  margin-left: 90px;
  border-top: 1px solid #b7b7b7;
  border-bottom: 1px solid #b7b7b7;
  width: 308px;
  .item-container {
    padding-left: 70px;
    height: 45px;
    font-size: 14px;
    cursor: pointer;
    &:hover {
      background: #f8f8f8;
    }
  }
  .selected-item-container {
    background: #f8f8f8;
    position: relative;
    &::before {
      content: '';
      width: 7px;
      height: 45px;
      position: absolute;
      background: #38ff4c;
      left: 0;
    }
  }
  .folder-item {
    text-align: left;
    width: 180px;
    padding-top: 11px;
    overflow: auto;
    white-space: nowrap;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .no-item-container {
    text-align: center;
    height: 75px;
    font-size: 12px;
    .no-item {
      padding-top: 28px;
      color: #848484;
    }
  }
`

const AddFolderForm = styled.div`
  margin-left: 78px;
  margin-top: 10px;
  .add-form-button {
    margin-left: 11px;
    border: 1px solid #d4d4d4;
    background: #f8f8f8;
    border-radius: 4px;
    width: 308px;
    height: 40px;
    cursor: pointer;
    .add-icon-container {
      display: inline-block;
      vertical-align: top;
      margin-top: 8px;
      margin-left: 33px;
      .MuiSvgIcon-root {
        color: #5c5c5c;
      }
    }
    .value {
      display: inline-block;
      margin-left: 30px;
      margin-top: 10px;
      font-size: 14px;
      color: #b3b3b3;
    }
    &:hover {
      background: #f2f2f2;
    }
  }
  .add-form-input {
    .MuiInputBase-root {
      margin-left: 12px;
      margin-bottom: 5px;
      .MuiInputBase-input {
        font-size: 14px;
        padding: 7px 10px;
        width: 288px;
      }
    }
    .MuiButton-root {
      font-size: 14px;
      padding: 3px;
      margin-left: 12px;
      width: 148px;
    }
    .add-button {
      background: #2db3ff;
      border: 1px solid #2db3ff;
      box-shadow: none;
      &:disabled {
        background: #a3deff;
        color: white;
      }
      &:hover {
        box-shadow: none;
        background: #209df8;
        border-color: #209df8;
      }
    }
    .cancel-button {
      background: #f1f1f1;
      color: black;
      border: 1px solid #b9c1c2;
      &:hover {
        background: #e4e4e4;
      }
    }
  }
`

const PaginationContainer = styled.div`
  position: absolute;
  top: 550px;
  left: 167px;
`
