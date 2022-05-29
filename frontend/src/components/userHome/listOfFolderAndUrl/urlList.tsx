import { useHistory } from 'react-router-dom'
import {
  Checkbox,
  Select,
  MenuItem,
  ListItemText,
  TextField,
  Button,
  ButtonGroup,
  Rating,
  Pagination,
} from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useEffect, useState } from 'react'
import format from 'date-fns/format'
import styled from 'styled-components'
import { useRecordBrowsingHistoryMutation, useEditUrlMutation, Url } from '../../../api/graphql'
import CreateUrlModal from '../createUrlModal'
import EditUrlModal from '../editUrlModal'
import DeleteUrlDialog from '../deleteUrlDialog'

interface propsType {
  selectUrlArray: Url[] | null | undefined
}

export default function UrlList({ props }: { props: propsType }) {
  const { selectUrlArray } = props
  const [sortRule, setSortRule] = useState('new')
  const [createUrlModalOpen, setCreateUrlModalOpen] = useState(false)
  const [editUrlModalOpen, setEditUrlModalOpen] = useState(false)
  const [editUrlId, setEditUrlId] = useState('')
  const [filterRule, setFilterRule] = useState<string[]>([])
  const [filterValue, setFilterValue] = useState('')
  const [displayUrlArray, setDisplayUrlArray] = useState<Url[]>([])
  const [deleteUrlDialogOpen, setDeleteUrlDialogOpen] = useState(false)
  const [deleteUrlId, setDeleteUrlId] = useState('')
  const [isDeleted, setIsDeleted] = useState(false)
  const [urlFullLength, setUrlFullLength] = useState(0)
  const [page, setPage] = useState(1)
  const history = useHistory()
  const [recordBrowsingHistoryMutation] = useRecordBrowsingHistoryMutation()
  const [editUrlMutation] = useEditUrlMutation()
  useEffect(() => {
    if (selectUrlArray) {
      const sortedArray = [...selectUrlArray]
      setUrlFullLength(sortedArray.length)
      setDisplayUrlArray(
        sortedArray.sort((a, b) => Number(b.id) - Number(a.id)).slice((page - 1) * 4, (page - 1) * 4 + 4)
      )
    }
  }, [selectUrlArray])
  useEffect(() => {
    if (selectUrlArray) {
      const sortedArray = [...selectUrlArray]
      let filterdArray: Url[] | null = []
      if (sortRule === 'new') {
        sortedArray.sort((a, b) => Number(b.id) - Number(a.id))
      } else if (sortRule === 'old') {
        sortedArray.sort((a, b) => Number(a.id) - Number(b.id))
      } else if (sortRule === 'importance') {
        sortedArray.sort((a, b) => b.importance - a.importance)
      }
      if (filterValue) {
        if (filterRule.length === 2) {
          if (filterRule.find((rule) => rule === 'title') && filterRule.find((rule) => rule === 'memo')) {
            filterdArray = sortedArray.filter((url) => {
              if (url.memo) {
                return url.title.indexOf(filterValue) !== -1 || url.memo.indexOf(filterValue) !== -1
              }
              return url.title.indexOf(filterValue) !== -1
            })
          } else if (filterRule.find((rule) => rule === 'title') && filterRule.find((rule) => rule === 'url')) {
            filterdArray = sortedArray.filter(
              (url) => url.title.indexOf(filterValue) !== -1 || url.url.indexOf(filterValue) !== -1
            )
          } else if (filterRule.find((rule) => rule === 'memo') && filterRule.find((rule) => rule === 'url')) {
            filterdArray = sortedArray.filter((url) => {
              if (url.memo) {
                return url.memo.indexOf(filterValue) !== -1 || url.url.indexOf(filterValue) !== -1
              }
              return url.url.indexOf(filterValue) !== -1
            })
          }
        } else if (filterRule.length === 1) {
          if (filterRule.find((rule) => rule === 'title')) {
            filterdArray = sortedArray.filter((url) => url.title.indexOf(filterValue) !== -1)
          } else if (filterRule.find((rule) => rule === 'memo')) {
            filterdArray = sortedArray.filter((url) => {
              if (url.memo) {
                return url.memo.indexOf(filterValue) !== -1
              }
              return false
            })
          } else if (filterRule.find((rule) => rule === 'url')) {
            filterdArray = sortedArray.filter((url) => url.url.indexOf(filterValue) !== -1)
          }
        } else {
          filterdArray = sortedArray.filter((url) => {
            if (url.memo) {
              return (
                url.url.indexOf(filterValue) !== -1 ||
                url.title.indexOf(filterValue) !== -1 ||
                url.memo.indexOf(filterValue) !== -1
              )
            }
            return url.url.indexOf(filterValue) !== -1 || url.title.indexOf(filterValue) !== -1
          })
        }
      } else {
        filterdArray = sortedArray
      }
      setUrlFullLength(filterdArray.length)
      setDisplayUrlArray(filterdArray.slice((page - 1) * 4, (page - 1) * 4 + 4))
    }
  }, [filterRule, filterValue, sortRule, page])

  useEffect(() => {
    if (isDeleted) {
      setIsDeleted(false)
      setDeleteUrlId('')
    }
  }, [isDeleted])
  useEffect(() => {
    if (page > Math.ceil(urlFullLength / 4)) {
      setPage(1)
    }
  }, [urlFullLength])

  return (
    <>
      <Container>
        <HeadLine>
          <FilterSelect>
            <Select
              value={filterRule}
              onChange={(e) => setFilterRule(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
              multiple
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <div className="place-holder">filter</div>
                }
                return selected
                  .map((selectValue) => {
                    if (selectValue === 'title') {
                      return 'タイトル'
                    }
                    if (selectValue === 'memo') {
                      return 'コメント'
                    }
                    return selectValue
                  })
                  .join(', ')
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    '& .MuiMenuItem-root': {
                      fontSize: '12px',
                      paddingLeft: '10px',
                      '& .place-holder': {
                        paddingLeft: '10px',
                      },
                    },
                    '& .MuiCheckbox-root': {
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                    '& .MuiTypography-root': {
                      fontSize: '14px',
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '18px',
                    },
                  },
                },
              }}
              displayEmpty
            >
              <MenuItem disabled value="">
                <div className="place-holder">filter</div>
              </MenuItem>
              <MenuItem value="title">
                <Checkbox checked={filterRule.indexOf('title') > -1} />
                <ListItemText primary="タイトル" />
              </MenuItem>
              <MenuItem value="memo">
                <Checkbox checked={filterRule.indexOf('memo') > -1} />
                <ListItemText primary="コメント" />
              </MenuItem>
              <MenuItem value="url">
                <Checkbox checked={filterRule.indexOf('url') > -1} />
                <ListItemText primary="url" />
              </MenuItem>
            </Select>
          </FilterSelect>
          <FilterInput>
            <TextField
              value={filterValue}
              onChange={(e) => {
                setFilterValue(e.target.value)
              }}
              placeholder="urlを探す..."
              variant="outlined"
            />
          </FilterInput>
          <SortSelect>
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
              <MenuItem value="importance">お気に入り順</MenuItem>
            </Select>
          </SortSelect>
          <AddButton>
            <Button onClick={() => setCreateUrlModalOpen(true)} variant="contained">
              追加
            </Button>
          </AddButton>
        </HeadLine>
        <Contents>
          {displayUrlArray.length ? (
            displayUrlArray.map((url, i) => (
              <div className={displayUrlArray.length - 1 === i ? 'last-item-container' : 'item-container'} key={url.id}>
                <div className="item-created-at">作成日 {format(new Date(1000 * url.createdAt), 'yyyy-MM-dd')}</div>
                <div
                  onClick={() => history.push(`/userHome/urlShow/${url.id}`)}
                  className="item-title"
                  role="button"
                  tabIndex={0}
                  key={url.id}
                >
                  {url.title}
                </div>
                <div
                  onClick={() => {
                    setDeleteUrlDialogOpen(true)
                    setDeleteUrlId(url.id)
                  }}
                  className="item-delete-button"
                  role="button"
                  tabIndex={0}
                  key={`deleteButton${url.id}`}
                >
                  <DeleteForeverIcon />
                </div>
                <br />
                <Rating
                  value={url.importance}
                  onChange={(_, newValue) =>
                    editUrlMutation({
                      variables: {
                        urlId: url.id,
                        url: {
                          url: url.url,
                          importance: newValue || 0,
                          title: url.title,
                          memo: url.memo,
                          notification: url.notification,
                        },
                      },
                    })
                  }
                  key={`rating-${url.id}`}
                />
                <ButtonGroup variant="outlined" key={`buttonGroup-${url.id}`}>
                  <Button
                    onClick={() => {
                      recordBrowsingHistoryMutation({
                        variables: { urlId: url.id, date: format(new Date(), 'yyyy-MM-dd') },
                      })
                      window.open(url.url, '_blank', 'noreferrer')
                    }}
                    key={`link-${url.id}`}
                  >
                    link
                  </Button>
                  <Button onClick={() => history.push(`/userHome/urlShow/${url.id}`)} key={`show-${url.id}`}>
                    詳細
                  </Button>
                  <Button
                    onClick={() => {
                      setEditUrlId(url.id)
                      setEditUrlModalOpen(true)
                    }}
                    key={`edit-${url.id}`}
                  >
                    編集
                  </Button>
                </ButtonGroup>
              </div>
            ))
          ) : (
            <div className="no-item-container">urlがありません。</div>
          )}
        </Contents>
        <PaginationContainer>
          {urlFullLength > 4 && (
            <Pagination
              count={Math.ceil(urlFullLength / 4)}
              onChange={(_, Currentpage) => {
                setPage(Currentpage)
              }}
              page={page}
            />
          )}
        </PaginationContainer>
      </Container>
      <CreateUrlModal props={{ createUrlModalOpen, setCreateUrlModalOpen }} />
      <EditUrlModal props={{ editUrlModalOpen, setEditUrlModalOpen, urlId: editUrlId }} />
      <DeleteUrlDialog props={{ deleteUrlDialogOpen, setDeleteUrlDialogOpen, deleteUrlId, setIsDeleted }} />
    </>
  )
}

const Container = styled.div`
  grid-area: urlList;
  position: relative;
`

const HeadLine = styled.div`
  margin-top: 75px;
  margin-left: 80px;
  position: relative;
`

const FilterSelect = styled.div`
  display: inline-block;
  vertical-align: bottom;
  .MuiInputBase-root {
    color: #b4b4b4;
    border-radius: 4px 0 0 4px;
    border-right: solid 0 red;
    .MuiSelect-select {
      font-size: 14px;
      padding: 2px;
      padding-left: 10px;
      color: black;
      .place-holder {
        color: #a0a0a0;
      }
    }
  }
`

const FilterInput = styled.div`
  display: inline-block;
  vertical-align: bottom;
  height: 27px;
  width: 320px;
  position: relative;
  .MuiInputBase-root {
    position: absolute;
    left: 0px;
    &:hover {
      left: -1px;
    }
    border-radius: 0 4px 4px 0;
    &.Mui-focused fieldset {
      border: solid 2px #1976d2;
      left: -1px;
    }
    &:hover {
      border-left: solid 1px black;
      box-sizing: border-box;
    }
    .MuiOutlinedInput-notchedOutline {
      border-left: none;
      border-color: #b4b4b4;
    }
    .MuiInputBase-input {
      width: 300px;
      font-size: 14px;
      padding: 6px 10px;
      height: 15px;
    }
  }
`

const SortSelect = styled.div`
  display: inline-block;
  vertical-align: bottom;
  margin-left: 30px;
  .MuiInputBase-root {
    .MuiSelect-select {
      font-size: 14px;
      padding: 2px;
      padding-left: 10px;
      color: #8a8a8a;
    }
  }
`

const AddButton = styled.div`
  display: inline-block;
  vertical-align: bottom;
  position: absolute;
  left: 740px;
  top: 0;
  .MuiButton-root {
    font-size: 14px;
    padding: 1px 12px;
    background: #20a1ff;
    box-shadow: none;
    min-width: 47px;
    &:hover {
      background: #2087ff;
      box-shadow: none;
    }
  }
`

const Contents = styled.div`
  margin-top: 20px;
  margin-left: 80px;
  position: relative;
  width: 810px;
  border-top: 1px solid #b4b4b4;
  border-bottom: 1px solid #b4b4b4;
  .item-container {
    height: 100px;
    position: relative;
    border-bottom: 1px solid #b4b4b4;
    &:hover {
      background: #f8f8f8;
    }
  }
  .last-item-container {
    height: 100px;
    position: relative;
    &:hover {
      background: #f8f8f8;
    }
  }
  .no-item-container {
    padding-top: 40px;
    height: 60px;
    text-align: center;
    font-size: 14px;
    color: #848484;
  }
  .item-created-at {
    font-size: 14px;
    color: #b4b4b4;
    padding-top: 5px;
    padding-left: 45px;
    padding-bottom: 3px;
  }
  .item-title {
    display: inline-block;
    vertical-align: top;
    margin-left: 70px;
    cursor: pointer;
    font-size: 14px;
    max-width: 460px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 3px;
    &:hover {
      color: #2b40ff;
      text-decoration: underline;
    }
  }
  .item-delete-button {
    display: inline-block;
    border: solid 1px black;
    border-radius: 50%;
    position: absolute;
    left: 620px;
    top: 15px;
    height: 26px;
    width: 26px;
    border-color: #b7b7b7;
    color: #b7b7b7;
    cursor: pointer;
    &:hover {
      border-color: #7a7a7a;
      color: #7a7a7a;
      background: #f6f6f6;
    }
    .MuiSvgIcon-root {
      font-size: 20px;
      margin-left: 3px;
      margin-top: 2px;
    }
  }
  .MuiRating-root {
    vertical-align: top;
    margin-top: 12px;
    margin-left: 67px;
  }
  .MuiButtonGroup-root {
    margin-left: 433px;
    margin-top: 7px;
    .MuiButton-root {
      font-size: 14px;
      padding: 2px 10px;
    }
  }
`

const PaginationContainer = styled.div`
  position: absolute;
  top: 565px;
  left: 400px;
`
