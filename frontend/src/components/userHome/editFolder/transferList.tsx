import { Select, MenuItem } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { useFetchFolderAndUrlQuery, Url } from '../../../api/graphql'

interface propTypes {
  urlList: Url[] | undefined | null
  setUrlList: Dispatch<SetStateAction<Url[] | undefined | null>>
  selectFolderId: string
  setSelectFolderId: Dispatch<SetStateAction<string>>
  selectFolderIdInTheOtherSide: string
  selectUrl: Url[] | undefined | null
  setSelectUrl: Dispatch<SetStateAction<Url[] | undefined | null>>
}

type UrlListProps = {
  isSelected?: boolean
}

export default function TransferList({ props }: { props: propTypes }) {
  const {
    urlList,
    setUrlList,
    selectFolderId,
    setSelectFolderId,
    selectFolderIdInTheOtherSide,
    selectUrl,
    setSelectUrl,
  } = props
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
  })

  const detectSelectedFolder = (folderId: string) => {
    if (fetchFolderAndUrl) {
      return fetchFolderAndUrl.find((folder) => folder.id === folderId)?.urls
    }
    return null
  }

  return (
    <Container>
      <FolderSelector>
        <Select
          onChange={(e) => {
            setSelectFolderId(e.target.value)
            setUrlList(detectSelectedFolder(e.target.value))
          }}
          value={selectFolderId}
          displayEmpty
          renderValue={selectFolderId !== '' ? undefined : () => <div className="placeholder">フォルダー</div>}
          variant="outlined"
          MenuProps={{
            PaperProps: {
              sx: {
                maxWidth: '230px',
                maxHeight: '385px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflowY: 'auto',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                '& .MuiMenuItem-root': {
                  fontSize: '12px',
                  overflow: 'auto',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                },
              },
            },
          }}
        >
          {fetchFolderAndUrl?.map((folder) => {
            if (selectFolderIdInTheOtherSide !== folder.id) {
              return (
                <MenuItem value={folder.id} key={folder.id}>
                  {folder.name}
                </MenuItem>
              )
            }
            return null
          })}
        </Select>
      </FolderSelector>
      {urlList && (
        <UrlListHeader
          onClick={() => {
            if (selectUrl?.length !== urlList.length) {
              setSelectUrl(urlList)
            } else if (selectUrl?.length === urlList.length) {
              setSelectUrl(null)
            }
          }}
          role="button"
          tabIndex={0}
        >
          {urlList.length && selectUrl?.length === urlList.length ? (
            <div className="select-icon">
              <CheckBoxIcon />
            </div>
          ) : (
            <CheckBoxOutlineBlankIcon />
          )}
          <div className="title-item">全て選択</div>
          <div className="count-item">
            {selectUrl?.length || 0}/{urlList.length}
          </div>
        </UrlListHeader>
      )}
      <UrlList isSelected={!!urlList}>
        {urlList ? (
          <>
            {urlList.map((url) => (
              <div
                onClick={() =>
                  setSelectUrl((previousUrl) => {
                    if (previousUrl) {
                      if (previousUrl.find((prevUrl) => prevUrl === url)) {
                        return previousUrl.filter((prevUrl) => prevUrl !== url)
                      }
                      return [...previousUrl, url]
                    }
                    return [url]
                  })
                }
                className="item-container"
                key={url.id}
                role="button"
                tabIndex={0}
              >
                {selectUrl?.find((selectedUrl) => selectedUrl.id === url.id) ? (
                  <div className="select-icon">
                    <CheckBoxIcon />
                  </div>
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
                <div className="title-item" key={url.id}>
                  {url.title || 'no title'}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="no-item-container">フォルダーを選択していません。</div>
        )}
      </UrlList>
    </Container>
  )
}

const Container = styled.div`
  display: inline-block;
`

const FolderSelector = styled.div`
  .MuiInputBase-root {
    font-size: 14px;
    .MuiSelect-select {
      padding: 7px 15px;
      padding-right: 32px;
      max-width: 255px;
      min-width: 40px;
    }
  }
  .placeholder {
    color: #aaa;
  }
`

const UrlListHeader = styled.div`
  width: 300px;
  height: 60px;
  margin-top: 20px;
  color: white;
  background: #3e3e3e;
  border: 1px solid #3e3e3e;
  border-radius: 3px 3px 0 0;
  border-bottom: none;
  &:hover {
    background: #3e3e3e;
  }
  .title-item {
    display: inline-block;
    vertical-align: top;
    margin-top: 20px;
    margin-left: 40px;
    font-size: 14px;
  }
  .count-item {
    display: inline-block;
    vertical-align: top;
    margin-left: 95px;
    margin-top: 30px;
    font-size: 13px;
  }
  .MuiSvgIcon-root {
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-top: 22px;
    margin-left: 35px;
  }
  .select-icon {
    display: inline-block;
    background: white;
    position: relative;
    border-radius: 2px;
    width: 15px;
    height: 15px;
    margin-top: 25px;
    margin-left: 38px;
    margin-bottom: 2px;
    margin-right: 2px;
    .MuiSvgIcon-root {
      position: absolute;
      top: -24.5px;
      left: -37.5px;
      color: #2395ff;
      font-size: 20px;
      &:hover {
        color: #1086f3;
      }
    }
  }
`

const UrlList = styled.div<UrlListProps>`
  margin-top: ${(props) => (props.isSelected ? '0' : '20px')};
  width: 300px;
  height: ${(props) => (props.isSelected ? '390px' : '450px')};
  font-size: 14px;
  border: solid 1px #818181;
  border-radius: ${(props) => (props.isSelected ? '0 0 3px 3px' : '3px')};
  ${(props) => (props.isSelected ? 'border-top: none;' : '')}
  background: #f9f9f9;
  overflow: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  .item-container {
    height: 60px;
    .title-item {
      display: inline-block;
      vertical-align: top;
      margin-top: 20px;
      margin-left: 40px;
      overflow: auto;
      max-width: 180px;
      white-space: nowrap;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    &:hover {
      background: #eaeaea;
    }
    .MuiSvgIcon-root {
      font-size: 20px;
      color: #454545;
      cursor: pointer;
      margin-top: 22px;
      margin-left: 35px;
    }
    .select-icon {
      display: inline-block;
      .MuiSvgIcon-root {
        color: #2395ff;
        font-size: 20px;
        &:hover {
          color: #1086f3;
        }
      }
    }
  }
  .no-item-container {
    text-align: center;
    margin-top: 212px;
    color: #9b9b9b;
  }
`
