import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import { useDeleteUrlMutation, FetchFolderUrlQuery, Url } from '../../api/graphql'
import SaveUrlModal from './saveUrlModal'
import EditUrlModal from './editUrlModal'

interface propsType {
  fetchFolderUrl: FetchFolderUrlQuery['fetchFolderUrl']
  urls: Url[] | null | undefined
  setUrls: (urls: Url[] | null | undefined) => void
}

export default function UrlListContainer({ props }: { props: propsType }) {
  const { urls, setUrls, fetchFolderUrl } = props
  const [urlSortRule, setUrlSortRule] = useState('sort')
  const [saveUrlModal, setSaveUrlModal] = useState(false)
  const [editUrlModal, setEditUrlModal] = useState(false)
  const [specifiedUrl, setSpecifiedUrl] = useState<Url | null>()
  const [filterValueForUrlList, setFilterValueForUrlList] = useState('')
  const [deleteUrlMutation] = useDeleteUrlMutation({
    onCompleted: ({ deleteUrl }) => {
      if (urls && urls[0]?.folderId === deleteUrl?.id) {
        setUrls(deleteUrl?.urls)
      }
    },
  })

  return (
    <>
      <button type="button" onClick={() => setSaveUrlModal(true)}>
        url作成モーダルを開く
      </button>
      <SaveUrlModal props={{ fetchFolderUrl,saveUrlModal, setSaveUrlModal, urls, setUrls }} />
      <EditUrlModal props={{ fetchFolderUrl, editUrlModal, setEditUrlModal, specifiedUrl, setSpecifiedUrl, setUrls }} />
      <Select
        value={urlSortRule}
        onChange={(e) => {
          setUrlSortRule(e.target.value)
        }}
      >
        <MenuItem value="sort">新しい順</MenuItem>
        <MenuItem value="sortReverse">古い順</MenuItem>
        <MenuItem value="sortImportance">お気に入り順</MenuItem>
      </Select>
      <input
        type="text"
        value={filterValueForUrlList}
        onChange={(e) => {
          setFilterValueForUrlList(e.target.value)
        }}
      />
      <button type="button" onClick={() => setFilterValueForUrlList('')}>
        reset
      </button>
      {urls &&
        (() => {
          const urlArrayForSort = [...urls]
          if (urlSortRule === 'sort') {
            urlArrayForSort.sort((a, b) => Number(b.id) - Number(a.id))
          } else if (urlSortRule === 'sortReverse') {
            urlArrayForSort.sort((a, b) => Number(a.id) - Number(b.id))
          } else if (urlSortRule === 'sortImportance') {
            urlArrayForSort.sort((a, b) => b.importance - a.importance)
          }
          let filteredArray: Url[] = []
          if (filterValueForUrlList !== '') {
            filteredArray = urlArrayForSort.filter(
              (url) =>
                url.url.match(filterValueForUrlList) ||
                url.title?.match(filterValueForUrlList) ||
                url.memo?.match(filterValueForUrlList)
            )
          } else {
            filteredArray = urlArrayForSort
          }

          return filteredArray.map((url) => (
            <div key={url.id}>
              <div key={url.id}>
                {url.id}:{url.url}:{url.importance}:{url.title}:{url.notification}
              </div>
              <button
                type="button"
                key={`editButton${url.id}`}
                onClick={() => {
                  setEditUrlModal(true)
                  setSpecifiedUrl(url)
                }}
              >
                url編集モーダルを開く
              </button>
              <button
                type="button"
                key={`deleteButton${url.id}`}
                onClick={() => {
                  deleteUrlMutation({ variables: { folderId: url.folderId, urlId: url.id } })
                }}
              >
                削除
              </button>
            </div>
          ))
        })()}
    </>
  )
}
