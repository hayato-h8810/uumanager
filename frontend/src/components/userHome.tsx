import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Modal from '@mui/material/Modal'
import {
  useCurrentUserQuery,
  useLogoutMutation,
  useDeleteUserMutation,
  useFetchFolderUrlQuery,
  useSaveUrlMutation,
  FetchFolderUrlDocument,
} from '../api/graphql'

interface fetchFolderUrlCacheType {
  fetchFolderUrl: Array<{
    __typename?: 'Folder' | undefined
    id: string
    name: string
    urls: urltype[]
  }>
}

interface urltype {
  __typename?: 'Url' | undefined
  id: string
  title?: string | null | undefined
  memo?: string | null | undefined
  notification?: string | null | undefined
  url: string
  importance: number
  folderId: string
}

export default function UserHome() {
  const [serverError, setServerError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [urls, setUrls] = useState<urltype[] | undefined>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newImportance, setNewImportance] = useState(1)
  const handleModalOpen = () => setModalOpen(true)
  const handleModalClose = () => setModalOpen(false)
  const history = useHistory()
  const [logoutMutation] = useLogoutMutation({
    onCompleted: (data) => {
      console.log(data?.logout?.id)
      if (!data?.logout?.id) history.push('/')
    },
  })
  const { data: { currentUser = null } = {}, loading } = useCurrentUserQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      if (!currentUser) history.push('/login')
    },
  })
  const { data: { fetchFolderUrl = null } = {} } = useFetchFolderUrlQuery({
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
    skip: !currentUser,
  })
  const [saveUrlMutation] = useSaveUrlMutation({
    update(cache, { data }) {
      const newCache = data?.saveUrl?.folder
      const existingCache: fetchFolderUrlCacheType | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      if (newCache && existingCache) {
        if (!existingCache.fetchFolderUrl.find((cacheData) => cacheData.id === newCache.id)) {
          cache.writeQuery({
            query: FetchFolderUrlDocument,
            data: { fetchFolderUrl: [...existingCache.fetchFolderUrl, newCache] },
          })
        }
      } else if (newCache && !existingCache) {
        cache.writeQuery({
          query: FetchFolderUrlDocument,
          data: { fetchFolderUrl: [newCache] },
        })
      }
    },
    onCompleted: ({ saveUrl }) => {
      if (urls && urls[0].folderId === saveUrl?.folder.urls[0].folderId) {
        setUrls(saveUrl?.folder.urls)
        console.log(saveUrl?.folder.urls)
      }
    },
  })
  const [deleteUserMutation] = useDeleteUserMutation({
    onCompleted: (data) => {
      console.log(data?.deleteUser?.user?.id)
      if (data?.deleteUser?.user?.id) history.push('/')
    },
    onError: (error) => {
      console.log(error)
      if (error?.message === 'PASSWORD_ERROR') {
        setServerError('パスワードが間違っています')
      }
    },
  })

  if (loading) return <h1>ロード中</h1>

  return (
    <Container>
      <h1>user home</h1>
      <button type="button" onClick={() => logoutMutation()} data-cy="logoutButton">
        ログアウト
      </button>
      <button type="button" onClick={() => handleModalOpen()} data-cy="openModal">
        ユーザー削除モーダル
      </button>
      <ModalContainer open={modalOpen} onClose={handleModalClose}>
        <div className="modalFrame">
          <button type="button" onClick={() => handleModalClose()}>
            閉じる
          </button>
          <div className="inputValue">パスワード</div>
          <input
            type="password"
            onChange={(e) => {
              setPasswordValue(e.target.value)
            }}
            value={passwordValue}
            data-cy="password"
          />
          {serverError !== '' && <p className="errorValue">{serverError}</p>}
          <button
            type="button"
            onClick={() => deleteUserMutation({ variables: { password: passwordValue } })}
            data-cy="deleteUserButton"
          >
            ユーザー削除
          </button>
        </div>
      </ModalContainer>
      <UrlButton>
        {fetchFolderUrl &&
          fetchFolderUrl.map((folder) => (
            <button
              type="button"
              key={folder.id}
              onClick={() => {
                setUrls(folder.urls)
                console.log(urls)
              }}
            >
              {folder.name}
            </button>
          ))}
      </UrlButton>
      <input
        type="text"
        onChange={(e) => {
          setNewFolderName(e.target.value)
        }}
        value={newFolderName}
      />
      <input
        type="text"
        onChange={(e) => {
          setNewUrl(e.target.value)
        }}
        value={newUrl}
      />
      <input
        type="number"
        onChange={(e) => {
          setNewImportance(e.target.valueAsNumber)
        }}
        value={newImportance}
      />
      <button
        type="button"
        onClick={() => {
          saveUrlMutation({ variables: { folderName: newFolderName, url: { url: newUrl, importance: newImportance } } })
          setNewFolderName('')
          setNewUrl('')
          setNewImportance(1)
        }}
      >
        urlsakusei
      </button>
      {urls &&
        urls.length !== 0 &&
        urls.map((url) => (
          <div key={url.id}>
            {url.url}:{url.importance}
          </div>
        ))}
    </Container>
  )
}

const Container = styled.div``

const ModalContainer = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;
    height: 70vh;
    aspect-ratio: 27/24;
    position: relative;
    right: 0;
    left: 0;
    margin: auto;
    top: 16vh;
  }
`

const UrlButton = styled.div`
  background: red;
`
