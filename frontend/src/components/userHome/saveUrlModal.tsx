import { useState } from 'react'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import jaLocale from 'date-fns/locale/ja'
import format from 'date-fns/format'
import styled from 'styled-components'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useSaveUrlMutation, FetchFolderUrlDocument, FetchFolderUrlQuery, Url } from '../../api/graphql'

type FormInput = {
  folderId: string | null
  importance: number
  url: string
  folderName: string | null
  title: string | null
  memo: string | null
}

interface propsType {
  fetchFolderUrl: FetchFolderUrlQuery['fetchFolderUrl']
  saveUrlModal: boolean
  setSaveUrlModal: (argument: boolean) => void
  urls: Url[] | null | undefined
  setUrls: (urls: Url[] | null | undefined) => void
}

export default function SaveUrlModal({ props }: { props: propsType }) {
  const { fetchFolderUrl, saveUrlModal, setSaveUrlModal, urls, setUrls } = props
  const [notificationValue, setNotificationValue] = useState<Date | null>(null)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })
  const [saveUrlMutation] = useSaveUrlMutation({
    update(cache, { data }) {
      const newCache = data?.saveUrl
      const existingCache: FetchFolderUrlQuery | null = cache.readQuery({
        query: FetchFolderUrlDocument,
      })
      // フォルダが既にある場合
      if (newCache && existingCache?.fetchFolderUrl) {
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
      }
      setSaveUrlModal(false)
      reset()
      setNotificationValue(null)
    },
  })
  const onSaveUrlSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
    saveUrlMutation({
      variables: {
        folderId: data.folderId === 'new' ? null : data.folderId,
        folderName: data.folderName === '' ? null : data.folderName,
        url: {
          url: data.url,
          importance: data.importance,
          title: data.title === '' ? null : data.title,
          memo: data.memo === '' ? null : data.memo,
          notification: notificationValue ? format(notificationValue, 'yyyy-MM-dd') : null,
        },
      },
    })
  }

  return (
    <ModalContainer open={saveUrlModal}>
      <div className="modalFrame">
        <form onSubmit={handleSubmit(onSaveUrlSubmit)}>
          <div>folder:</div>
          <Select {...register('folderId')} defaultValue="new">
            <MenuItem value="new">新しくフォルダーを作成する。</MenuItem>
            {fetchFolderUrl &&
              fetchFolderUrl.map((folder) => (
                <MenuItem value={folder.id} key={folder.id}>
                  {folder.name}
                </MenuItem>
              ))}
          </Select>
          <TextField
            {...register('folderName')}
            type="text"
            label="フォルダー"
            variant="outlined"
            size="small"
            disabled={watch('folderId') !== undefined && watch('folderId') !== 'new'}
          />
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
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={jaLocale}>
            <DatePicker
              label="通知日"
              value={notificationValue}
              onChange={(newValue) => {
                if (newValue) {
                  setNotificationValue(newValue)
                }
              }}
              renderInput={(params) => <TextField {...params} />}
              mask="____/__/__"
              minDate={new Date()}
            />
          </LocalizationProvider>
          <button
            type="button"
            onClick={() => {
              setNotificationValue(null)
            }}
          >
            clear data
          </button>
          <button type="submit">url作成</button>
        </form>
        <button
          type="button"
          onClick={() => {
            setSaveUrlModal(false)
            reset()
            setNotificationValue(null)
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
