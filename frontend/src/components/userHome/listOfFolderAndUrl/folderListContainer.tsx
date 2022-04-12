import { useState } from 'react'
import styled from 'styled-components'
import Modal from '@mui/material/Modal'
import {
  useDeleteFolderMutation,
  useEditFolderMutation,
  useAddFolderMutation,
  FetchFolderUrlDocument,
  FetchFolderUrlQuery,
  Url,
} from '../../../api/graphql'

interface propsType {
  fetchFolderUrl: FetchFolderUrlQuery['fetchFolderUrl']
  setUrls: (urls: Url[] | null) => void
}

export default function FolderListContainer({ props }: { props: propsType }) {
  const { fetchFolderUrl, setUrls } = props
  const [isShownDeletedFolder, setIsShownDeletedFolder] = useState(false)
  const [deleteFolderModal, setDeleteFolderModal] = useState(false)
  const [editFolderModal, setEditFolderModal] = useState(false)
  const [addFolderModal, setAddFolderModal] = useState(false)
  const [deletedFolder, setDeletedFolder] = useState<string | null>()
  const [specifiedFolder, setSpecifiedFolder] = useState<string | null>()
  const [editFolderName, setEditFolderName] = useState('')
  const [deleteFolderMutation] = useDeleteFolderMutation({
    update(cache, { data }) {
      const newCache = data?.deleteFolder
      const existingCache: FetchFolderUrlQuery | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      cache.writeQuery({
        query: FetchFolderUrlDocument,
        data: { fetchFolderUrl: existingCache?.fetchFolderUrl?.filter((cacheDate) => cacheDate.id !== newCache?.id) },
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
      const existingCache: FetchFolderUrlQuery | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      if (existingCache?.fetchFolderUrl)
        cache.writeQuery({
          query: FetchFolderUrlDocument,
          data: { fetchFolderUrl: [...existingCache.fetchFolderUrl, newCache] },
        })
    },
    onCompleted: () => {
      setAddFolderModal(false)
    },
  })

  return (
    <Container>
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
    </Container>
  )
}

const Container = styled.div`
  background: red;
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
