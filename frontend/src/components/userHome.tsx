import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useForm, SubmitHandler } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import styled from 'styled-components'
import Modal from '@mui/material/Modal'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import {
  useCurrentUserQuery,
  useLogoutMutation,
  useDeleteUserMutation,
  useFetchFolderUrlQuery,
  useSaveUrlMutation,
  useDeleteUrlMutation,
  useEditUrlMutation,
  useDeleteFolderMutation,
  useEditFolderMutation,
  useAddFolderMutation,
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

type FormInput = {
  importance: number
  url: string
  folder: string | null
  title: string | null
  memo: string | null
  notification: string | null
  folderId: string | null
}

export default function UserHome() {
  const [serverError, setServerError] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [saveUrlModal, setSaveUrlModal] = useState(false)
  const [editUrlModal, setEditUrlModal] = useState(false)
  const [deleteFolderModal, setDeleteFolderModal] = useState(false)
  const [editFolderModal, setEditFolderModal] = useState(false)
  const [addFolderModal, setAddFolderModal] = useState(false)
  const [urls, setUrls] = useState<urltype[] | null>()
  const [specifiedUrl, setSpecifiedUrl] = useState<urltype | null>()
  const [deletedFolder, setDeletedFolder] = useState<string | null>()
  const [specifiedFolder, setSpecifiedFolder] = useState<string | null>()
  const [isShownDeletedFolder, setIsShownDeletedFolder] = useState(false)
  const [editFolderName, setEditFolderName] = useState('')
  const [urlSortRule, setUrlSortRule] = useState('sort')
  const history = useHistory()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })

  const [logoutMutation] = useLogoutMutation({
    onCompleted: (data) => {
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
      const newCache = data?.saveUrl
      const existingCache: fetchFolderUrlCacheType | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      // フォルダが既にある場合
      if (newCache && existingCache) {
        // 新しいフォルダを作成した場合
        if (!existingCache.fetchFolderUrl.find((cacheData) => cacheData.id === newCache.id)) {
          cache.writeQuery({
            query: FetchFolderUrlDocument,
            data: { fetchFolderUrl: [...existingCache.fetchFolderUrl, newCache] },
          })
        }
        // 初めてフォルダを作成する場合
      } else if (newCache && !existingCache) {
        cache.writeQuery({
          query: FetchFolderUrlDocument,
          data: { fetchFolderUrl: [newCache] },
        })
      }
    },
    onCompleted: ({ saveUrl }) => {
      if (urls && urls[0]?.folderId === saveUrl?.id) {
        setUrls(saveUrl?.urls)
        setSaveUrlModal(false)
        reset()
      }
    },
  })
  const [deleteUserMutation] = useDeleteUserMutation({
    onCompleted: (data) => {
      if (data?.deleteUser?.user?.id) history.push('/')
    },
    onError: (error) => {
      if (error?.message === 'PASSWORD_ERROR') {
        setServerError('パスワードが間違っています')
      }
    },
  })
  const [deleteUrlMutation] = useDeleteUrlMutation({
    onCompleted: ({ deleteUrl }) => {
      if (urls && urls[0]?.folderId === deleteUrl?.id) {
        setUrls(deleteUrl?.urls)
      }
    },
  })
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: ({ editUrl }) => {
      if (editUrl && editUrl.length === 1) {
        setUrls(editUrl[0]?.urls)
      } else if (editUrl && specifiedUrl && editUrl.length === 2) {
        const displayedFolder = editUrl.find((folder) => folder.id === specifiedUrl.folderId)
        setUrls(displayedFolder?.urls)
      }
      setEditUrlModal(false)
      setSpecifiedUrl(null)
      reset()
    },
  })
  const [deleteFolderMutation] = useDeleteFolderMutation({
    update(cache, { data }) {
      const newCache = data?.deleteFolder
      const existingCache: fetchFolderUrlCacheType | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      cache.writeQuery({
        query: FetchFolderUrlDocument,
        data: { fetchFolderUrl: existingCache?.fetchFolderUrl.filter((cacheDate) => cacheDate.id !== newCache?.id) },
      })
    },
    onCompleted: () => {
      setDeleteFolderModal(false)
      setDeletedFolder(null)
      setUrls(null)
    },
  })
  const [editFolderMutation] = useEditFolderMutation({
    onCompleted: () => {
      setEditFolderModal(false)
    },
  })
  const [addFolderMutation] = useAddFolderMutation({
    update(cache, { data }) {
      const newCache = data?.addFolder
      const existingCache: fetchFolderUrlCacheType | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      if (existingCache)
        cache.writeQuery({
          query: FetchFolderUrlDocument,
          data: { fetchFolderUrl: [...existingCache.fetchFolderUrl, newCache] },
        })
    },
    onCompleted: () => {
      setAddFolderModal(false)
    },
  })
  const onSaveUrlSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
    saveUrlMutation({
      variables: {
        folderName: data.folder === '' ? null : data.folder,
        url: {
          url: data.url,
          importance: data.importance,
          title: data.title === '' ? null : data.title,
          memo: data.memo === '' ? null : data.memo,
          notification: data.notification === '' ? null : data.notification,
        },
      },
    })
  }
  const onEditUrlSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
    editUrlMutation({
      variables: {
        urlId: specifiedUrl?.id || '',
        folderId: data.folderId === '選択しない' ? null : data.folderId,
        url: {
          url: data.url,
          importance: data.importance,
          title: data.title === '' ? null : data.title,
          memo: data.memo === '' ? null : data.memo,
          notification: data.notification === '' ? null : data.notification,
        },
      },
    })
  }

  if (loading) return <h1>ロード中</h1>

  return (
    <Container>
      <h1>user home</h1>
      <button type="button" onClick={() => logoutMutation()} data-cy="logoutButton">
        ログアウト
      </button>
      <button type="button" onClick={() => setModalOpen(true)} data-cy="openModal">
        ユーザー削除モーダル
      </button>
      <ModalContainer open={modalOpen} onBackdropClick={() => setModalOpen(false)}>
        <div className="modalFrame">
          <button type="button" onClick={() => setModalOpen(false)}>
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
            <div
              key={folder.id}
              onMouseEnter={() => {
                setIsShownDeletedFolder(true)
                setDeletedFolder(folder.id)
              }}
              onMouseLeave={() => setIsShownDeletedFolder(false)}
            >
              <button
                type="button"
                key={folder.id}
                onClick={() => {
                  setUrls(folder.urls)
                }}
              >
                {folder.name}
              </button>
              {isShownDeletedFolder && deletedFolder === folder.id && (
                <button
                  type="button"
                  key={`deleteFolder${folder.id}`}
                  onClick={() => {
                    setDeleteFolderModal(true)
                  }}
                >
                  {folder.name}を削除
                </button>
              )}
              <button
                key={`editFolder${folder.id}`}
                type="button"
                onClick={() => {
                  setEditFolderModal(true)
                  setSpecifiedFolder(folder.id)
                }}
              >
                編集
              </button>
            </div>
          ))}
      </UrlButton>
      <DeleteFolderModal open={deleteFolderModal}>
        <div className="modalFrame">
          <button
            type="button"
            onClick={() => {
              deleteFolderMutation({ variables: { folderId: deletedFolder || '' } })
            }}
          >
            {deletedFolder}を削除
          </button>
          <button
            type="button"
            onClick={() => {
              setDeleteFolderModal(false)
              setDeletedFolder(null)
            }}
          >
            戻る
          </button>
        </div>
      </DeleteFolderModal>
      <EditFolderModal open={editFolderModal}>
        <div className="modalFrame">
          <div>name:</div>
          <input type="text" value={editFolderName} onChange={(e) => setEditFolderName(e.target.value)} />
          <button
            type="button"
            onClick={() =>
              editFolderMutation({ variables: { folderId: specifiedFolder || '', folderName: editFolderName } })
            }
          >
            編集
          </button>
          <button type="button" onClick={() => setEditFolderModal(false)}>
            閉じる
          </button>
        </div>
      </EditFolderModal>
      <button type="button" onClick={() => setAddFolderModal(true)}>
        folder作成モーダルを開く
      </button>
      <AddFolderModal open={addFolderModal}>
        <div className="modalFrame">
          <div>folder作成</div>
          <input type="text" value={editFolderName} onChange={(e) => setEditFolderName(e.target.value)} />
          <button type="button" onClick={() => addFolderMutation({ variables: { folderName: editFolderName } })}>
            作成
          </button>
          <button type="button" onClick={() => setAddFolderModal(false)}>
            閉じる
          </button>
        </div>
      </AddFolderModal>
      <button type="button" onClick={() => setSaveUrlModal(true)}>
        url作成モーダルを開く
      </button>
      <SaveUrlModal open={saveUrlModal}>
        <div className="modalFrame">
          <form onSubmit={handleSubmit(onSaveUrlSubmit)}>
            <div>folder:</div>
            <TextField {...register('folder')} type="text" label="フォルダー" variant="outlined" size="small" />
            <div>url:</div>
            <TextField
              {...register('url', { required: true })}
              type="text"
              label="url"
              variant="outlined"
              size="small"
            />
            {errors.url && <p>url欄の入力は必須です。</p>}
            <div>importance:</div>
            <TextField
              {...register('importance', { valueAsNumber: true, required: true })}
              type="number"
              label="重要度"
              variant="outlined"
              size="small"
            />
            <div>title</div>
            <TextField {...register('title')} type="text" label="タイトル" variant="outlined" size="small" />
            <div>memo</div>
            <TextField {...register('memo')} type="text" label="メモ" variant="outlined" size="small" />
            <div>notification</div>
            <TextField {...register('notification')} type="text" label="通知日" variant="outlined" size="small" />
            <button type="submit">url作成</button>
          </form>
          <button
            type="button"
            onClick={() => {
              setSaveUrlModal(false)
              reset()
            }}
          >
            閉じる
          </button>
        </div>
      </SaveUrlModal>
      <EditUrlModal open={editUrlModal}>
        <div className="modalFrame">
          <div>
            {specifiedUrl?.id}:{specifiedUrl?.url}の編集
          </div>
          <form onSubmit={handleSubmit(onEditUrlSubmit)}>
            <div>folder:</div>
            <Select {...register('folderId')} label="フォルダー" defaultValue="選択しない" autoWidth>
              <MenuItem value="選択しない">選択しない</MenuItem>
              {fetchFolderUrl
                ?.filter((folder) => folder.id !== specifiedUrl?.folderId)
                .map((folder) => (
                  <MenuItem value={folder.id} key={folder.id}>
                    {folder.name}
                  </MenuItem>
                ))}
            </Select>
            <div>url:</div>
            <TextField
              {...register('url', { required: true })}
              type="text"
              label="url"
              variant="outlined"
              size="small"
            />
            {errors.url && <p>url欄の入力は必須です。</p>}
            <div>importance:</div>
            <TextField
              {...register('importance', { valueAsNumber: true, required: true })}
              type="number"
              label="重要度"
              variant="outlined"
              size="small"
            />
            <div>title</div>
            <TextField {...register('title')} type="text" label="タイトル" variant="outlined" size="small" />
            <div>memo</div>
            <TextField {...register('memo')} type="text" label="メモ" variant="outlined" size="small" />
            <div>notification</div>
            <TextField {...register('notification')} type="text" label="通知日" variant="outlined" size="small" />
            <button type="submit">編集</button>
          </form>
          <button
            type="button"
            onClick={() => {
              setEditUrlModal(false)
              setSpecifiedUrl(undefined)
              reset()
            }}
          >
            閉じる
          </button>
        </div>
      </EditUrlModal>
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
      {urls &&
        (() => {
          const urlArrayForSort = [...urls]

          if (urlSortRule === 'sort') {
            urlArrayForSort.sort((a, b) => Number(a.id) - Number(b.id))
          } else if (urlSortRule === 'sortReverse') {
            urlArrayForSort.sort((a, b) => Number(b.id) - Number(a.id))
          } else if (urlSortRule === 'sortImportance') {
            urlArrayForSort.sort((a, b) =>  b.importance-a.importance)
          }

          return urlArrayForSort.map((url) => (
            <div key={url.id}>
              <div key={url.id}>
              {url.id}:{url.url}:{url.importance}
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

    position: relative;
  }
`

const UrlButton = styled.div`
  background: red;
`
const SaveUrlModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`

const EditUrlModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`

const DeleteFolderModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`

const EditFolderModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`

const AddFolderModal = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`
