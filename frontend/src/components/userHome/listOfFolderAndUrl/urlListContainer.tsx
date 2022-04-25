import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import format from 'date-fns/format'
import {
  useDeleteUrlMutation,
  useRecordBrowsingHistoryMutation,
  Url,
} from '../../../api/graphql'
import CreateUrlModal from '../createUrlModal'

interface propsType {
  urls: Url[] | null | undefined
  setUrls: (urls: Url[] | null | undefined) => void
}

export default function UrlListContainer({ props }: { props: propsType }) {
  const { urls, setUrls} = props
  const [urlSortRule, setUrlSortRule] = useState('sort')
  const [createUrlModalOpen, setCreateUrlModalOpen] = useState(false)
  const [filterValueForUrlList, setFilterValueForUrlList] = useState('')
  const [deleteUrlMutation] = useDeleteUrlMutation({
    onCompleted: ({ deleteUrl }) => {
      if (urls && urls[0]?.folderId === deleteUrl?.id) {
        setUrls(deleteUrl?.urls)
      }
    },
  })
  const [recordBrowsingHistoryMutation] = useRecordBrowsingHistoryMutation()
  const handleLinkClick = (urlId: string) =>
    recordBrowsingHistoryMutation({ variables: { urlId, date: format(new Date(), 'yyyy-MM-dd') } })

  return (
    <>
      <button type="button" onClick={() => setCreateUrlModalOpen(true)}>
        url作成モーダルを開く
      </button>
      <CreateUrlModal props={{ createUrlModalOpen, setCreateUrlModalOpen }} />

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
                <a href={url.url} onClick={() => handleLinkClick(url.id)} target="_blank" rel="noopener noreferrer">
                  link
                </a>
              </div>
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
