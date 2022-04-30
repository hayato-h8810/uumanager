import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { TextField, Button, Select, MenuItem, ClickAwayListener } from '@mui/material'
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
  displayUrlArray: Url[] | null | undefined
  setDisplayUrlArray: (urls: Url[] | null) => void
}

export default function ShowFolderList({ props }: { props: propsType }) {
  const { displayUrlArray, setDisplayUrlArray } = props
  const [selectedFolderId, setSelectedFolderId] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortRule, setSortRule] = useState('new')
  const [displayFolders, setDisplayFolders] = useState<Folder[] | null>(null)
  const [addFormInputtable, setAddFormInputtable] = useState(false)
  const [addFormValue, setAddFormValue] = useState('')
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data.fetchFolderAndUrl && !displayUrlArray) {
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
      if (existingCache?.fetchFolderAndUrl)
        cache.writeQuery({
          query: FetchFolderAndUrlDocument,
          data: { fetchFolderAndUrl: [...existingCache.fetchFolderAndUrl, newCache] },
        })
    },
    onCompleted: () => {
      setAddFormInputtable(false)
      setAddFormValue('')
    },
  })
  useEffect(() => {
    const selectedUrls = fetchFolderAndUrl?.find((folder) => folder.id === selectedFolderId)?.urls
    if (selectedUrls) {
      setDisplayUrlArray(selectedUrls)
    }
  }, [selectedFolderId, fetchFolderAndUrl])

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
        setDisplayFolders(sortedArray.filter((folder) => folder.name.match(filterValue)))
      } else {
        setDisplayFolders(sortedArray)
      }
    }
  }, [fetchFolderAndUrl, filterValue, sortRule])

  return (
    <Container>
      <Title>フォルダー</Title>
      <EditButton>
        <Button variant="text">編集</Button>
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
    left: 370px;
  }
`

const Title = styled.div`
  margin-top: 40px;
  margin-left: 90px;
  font-size: 20px;
  position: relative;
  &::before {
    content: '';
    width: 233px;
    height: 1px;
    position: absolute;
    background: #b7b7b7;
    top: 75px;
  }
`

const EditButton = styled.div`
  top: 45px;
  left: 260px;
  position: absolute;
  .MuiButton-root {
    font-size: 12px;
    padding: 4px 10px;
  }
`

const Filter = styled.div`
  display: inline-block;
  margin-left: 90px;
  margin-top: 7px;
  .MuiInputBase-root {
    margin-top: 2px;
    .MuiInputBase-input {
      width: 120px;
      font-size: 10px;
      padding: 6px 10px;
    }
  }
`

const Sort = styled.div`
  display: inline-block;
  margin-left: 10px;
  .MuiInputBase-root .MuiSelect-select {
    font-size: 10px;
    padding: 2px;
    padding-left: 10px;
  }
`

const Contents = styled.div`
  max-height: 360px;
  margin-top: 11px;
  margin-left: 90px;
  width: 233px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f2f2f2;
  }
  &::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 5px;
  }
  .item-container {
    width: 165px;
    padding-left: 60px;
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
      width: 10px;
      height: 45px;
      position: absolute;
      background: #38ff4c;
      left: 0;
    }
  }
  .folder-item {
    text-align: left;
    width: 130px;
    padding-top: 11px;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .no-item-container {
    width: 165px;
    padding-left: 50px;
    height: 45px;
    font-size: 10px;
    .no-item {
      width: 150px;
      padding-top: 15px;
      color: #848484;
    }
  }
`

const AddFolderForm = styled.div`
  position: relative;
  margin-left: 78px;
  margin-top: 10px;
  .add-form-button {
    margin-left: 10px;
    border: 1px solid #d4d4d4;
    background: #f8f8f8;
    border-radius: 4px;
    width: 233px;
    height: 30px;
    vertical-align: middle;
    .add-icon-container {
      display: inline-block;
      position: relative;
      .MuiSvgIcon-root {
        position: absolute;
        top: -17px;
        left: 20px;
        color: #5c5c5c;
      }
    }
    .value {
      display: inline-block;
      margin-left: 57px;
      margin-top: 6px;
      font-size: 12px;
      color: #b3b3b3;
    }
  }
  .add-form-input {
    .MuiInputBase-root {
      margin-left: 10px;
      margin-bottom: 5px;
      .MuiInputBase-input {
        font-size: 12px;
        padding: 7px 10px;
        width: 213px;
      }
    }
    .MuiButton-root {
      font-size: 10px;
      padding: 6px 31.5px;
      margin-left: 10px;
    }
    .add-button {
      background: #2db3ff;
      border: 1px solid #2db3ff;
      &:disabled {
        background: #a3deff;
        color: white;
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
  &::before {
    content: '';
    width: 233px;
    height: 1px;
    position: absolute;
    background: #b7b7b7;
    top: -10px;
    left: 12px;
  }
`
