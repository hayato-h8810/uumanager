import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import styled from 'styled-components'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEditUrlMutation, FetchFolderUrlQuery, Url } from '../../api/graphql'

type FormInput = {
  importance: number
  url: string
  title: string | null
  memo: string | null
  notification: string | null
  folderId: string | null
}

interface propsType {
  fetchFolderUrl: FetchFolderUrlQuery['fetchFolderUrl']
  editUrlModal: boolean
  setEditUrlModal: (argument: boolean) => void
  specifiedUrl: Url | null | undefined
  setSpecifiedUrl: (urls: Url | null | undefined) => void
  setUrls: (urls: Url[] | null | undefined) => void
}

export default function EditUrlModal({ props }: { props: propsType }) {
  const { fetchFolderUrl, editUrlModal, setEditUrlModal, specifiedUrl, setSpecifiedUrl, setUrls } = props
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })

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
  return (
    <ModalContainer open={editUrlModal}>
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
          <TextField {...register('url', { required: true })} type="text" label="url" variant="outlined" size="small" />
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
    </ModalContainer>
  )
}

const ModalContainer = styled(Modal)`
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modalFrame {
    background: white;

    position: relative;
  }
`