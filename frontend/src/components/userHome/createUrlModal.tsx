import { Modal, TextField, MenuItem, Button, IconButton, Rating, Select, FormControl, InputLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import styled from 'styled-components'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import jaLocale from 'date-fns/locale/ja'
import format from 'date-fns/format'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useState } from 'react'
import {
  useSaveUrlMutation,
  FetchFolderAndUrlDocument,
  FetchFolderAndUrlQuery,
  useFetchFolderAndUrlQuery,
} from '../../api/graphql'

type FormInput = {
  url: string
  title: string
  memo: string | null
  notification: string | null
  folderId: string | null
  folderName: string | null
}

interface propsType {
  createUrlModalOpen: boolean
  setCreateUrlModalOpen: (boolean: boolean) => void
}

type ModalContainerProps = {
  folderNameDisable?: boolean
}

export default function CreateUrlModal({ props }: { props: propsType }) {
  const { createUrlModalOpen, setCreateUrlModalOpen } = props
  const [notificationValue, setNotificationValue] = useState<Date | null>(null)
  const [importanceValue, setImportanceValue] = useState<number | undefined | null>(0)
  const [folderId, setFolderId] = useState('new')
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({ fetchPolicy: 'network-only' })
  const [saveUrlMutation] = useSaveUrlMutation({
    update(cache, { data }) {
      const newCache = data?.saveUrl
      const existingCache: FetchFolderAndUrlQuery | null = cache.readQuery({
        query: FetchFolderAndUrlDocument,
      })
      // フォルダが既にある場合
      if (newCache && existingCache?.fetchFolderAndUrl) {
        // 新しいフォルダを作成した場合
        if (!existingCache.fetchFolderAndUrl.find((cacheData) => cacheData.id === newCache.id)) {
          cache.writeQuery({
            query: FetchFolderAndUrlDocument,
            data: { fetchFolderAndUrl: [...existingCache.fetchFolderAndUrl, newCache] },
          })
        }
        // 初めてフォルダを作成する場合
      } else {
        cache.writeQuery({
          query: FetchFolderAndUrlDocument,
          data: { fetchFolderAndUrl: [newCache] },
        })
      }
    },
    onCompleted: () => {
      setCreateUrlModalOpen(false)
      setNotificationValue(null)
      setFolderId('new')
      setImportanceValue(0)
      reset()
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormInput>({
    reValidateMode: 'onSubmit',
  })

  const onSaveUrlSubmit: SubmitHandler<FormInput> = (data) => {
    if (importanceValue || importanceValue === 0)
      saveUrlMutation({
        variables: {
          folderId: data.folderId === 'new' ? null : data.folderId,
          folderName: data.folderName === '' ? null : data.folderName,
          url: {
            url: data.url,
            importance: importanceValue,
            title: data.title,
            memo: data.memo === '' ? null : data.memo,
            notification: notificationValue ? format(notificationValue, 'yyyy-MM-dd') : null,
          },
        },
      })
  }

  return (
    <ModalContainer open={createUrlModalOpen} folderNameDisable={folderId !== 'new'}>
      <div className="modal-frame">
        <HeadLine>
          <div className="title">新規作成</div>
          <Button
            onClick={() => {
              setFolderId('new')
              setNotificationValue(null)
              setImportanceValue(0)
              reset()
            }}
            variant="outlined"
            size="small"
          >
            リセット
          </Button>
          <IconButton
            onClick={() => {
              setCreateUrlModalOpen(false)
              setNotificationValue(null)
              setImportanceValue(0)
              setFolderId('new')
              reset()
            }}
          >
            <CloseIcon />
          </IconButton>
        </HeadLine>
        <Contents>
          <form onSubmit={handleSubmit(onSaveUrlSubmit)}>
            <div className="item-container">
              <div className="label">重要度</div>
              <div className="rating">
                <Rating
                  value={importanceValue}
                  onChange={(_, newValue) => {
                    setImportanceValue(newValue)
                  }}
                />
              </div>
            </div>
            <div className="item-container multiline-item-container">
              <div className="label">タイトル</div>
              <TextField
                {...register('title', { required: true })}
                type="text"
                label="タイトル"
                variant="outlined"
                multiline
                size="small"
                rows={4}
              />
              {errors.title && <ErrorMessage>タイトルは必須項目です。</ErrorMessage>}
            </div>
            <div className="item-container oneline-item-container url-item-container">
              <div className="label">url</div>
              <TextField
                {...register('url', {
                  required: true,
                  pattern: /https?:\/\/[-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g,
                })}
                type="text"
                label="url"
                variant="outlined"
                size="small"
              />
              {errors.url?.type === 'required' && <ErrorMessage>url欄の入力は必須です。</ErrorMessage>}
              {errors.url?.type === 'pattern' && <ErrorMessage>urlの形式が正しくありません。</ErrorMessage>}
            </div>
            <div className="item-container folder-item-container">
              <div className="label">フォルダー</div>
              <FormControl>
                <InputLabel>フォルダー</InputLabel>
                <Select
                  {...register('folderId')}
                  onChange={(e) => {
                    setFolderId(e.target.value)
                    clearErrors('folderName')
                  }}
                  value={folderId}
                  label="フォルダー"
                  variant="outlined"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxWidth: '230px',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxHeight: '385px',
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
                  <MenuItem value="new">新しくフォルダーを作成する。</MenuItem>
                  {fetchFolderAndUrl?.map((folder) => (
                    <MenuItem value={folder.id} key={folder.id}>
                      {folder.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {folderId === 'new' && (
                <div className="folder-name-item">
                  <TextField
                    {...register('folderName', { validate: (value) => !(value === '' && folderId === 'new') })}
                    type="text"
                    label="フォルダー"
                    variant="outlined"
                    size="small"
                    disabled={folderId !== 'new'}
                  />
                </div>
              )}
              {errors.folderName && <ErrorMessage>フォルダー名を入力して下さい。</ErrorMessage>}
            </div>
            <div className="item-container multiline-item-container">
              <div className="label">コメント</div>
              <TextField
                {...register('memo')}
                type="text"
                label="コメント"
                variant="outlined"
                multiline
                size="small"
                rows={4}
              />
            </div>
            <div className="item-container oneline-item-container notification-item-container">
              <div className="label">通知日</div>
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
              <div className="clear-button">
                <IconButton onClick={() => setNotificationValue(null)}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </div>
            </div>
            <SaveButton>
              <Button type="submit" variant="contained">
                保存
              </Button>
            </SaveButton>
          </form>
        </Contents>
      </div>
    </ModalContainer>
  )
}

const ModalContainer = styled(Modal)<ModalContainerProps>`
  position: relative;
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modal-frame {
    background: white;
    max-height: 100%;
    max-width: 100%;
    height: ${(props) => (props.folderNameDisable ? '690px' : '730px')};
    width: 750px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`

const HeadLine = styled.div`
  position: relative;
  margin-top: 40px;
  width: 750px;
  .title {
    display: inline-block;
    font-size: 20px;
    margin-left: 100px;
    min-width: 300px;
  }
  .MuiButton-root {
    margin-top: 10px;
    margin-left: 140px;
    font-size: 10px;
  }
  .MuiIconButton-root {
    position: absolute;
    top: -30px;
    left: 680px;
  }
  &::before {
    content: '';
    background: #bbbbbb;
    width: 650px;
    height: 1px;
    position: absolute;
    top: 45px;
    left: 50px;
  }
`

const Contents = styled.div`
  padding-top: 10px;
  width: 750px;
  .item-container {
    min-height: 40px;
    margin-top: 30px;
    position: relative;
    .label {
      display: inline-block;
      width: 250px;
      margin-left: 140px;
      font-size: 14px;
    }
    .rating {
      display: inline-block;
      position: absolute;
    }
    .MuiInputLabel-root {
      font-size: 12px;
    }
    .MuiInputBase-root {
      font-size: 12px;
    }
  }
  .oneline-item-container .MuiInputBase-root .MuiInputBase-input {
    padding: 7px 10px;
  }
  .multiline-item-container .MuiTextField-root {
    width: 230px;
    .MuiInputBase-inputMultiline {
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .url-item-container {
    .MuiInputLabel-root {
      top: -3px;
    }
    .MuiInputLabel-shrink {
      top: 0;
    }
  }
  .notification-item-container {
    .MuiTextField-root {
      width: 140px;
    }
    .MuiInputLabel-root {
      top: -8px;
    }
    .MuiInputLabel-shrink {
      top: 0;
    }
    .clear-button {
      position: absolute;
      top: -4px;
      left: 535px;
      .MuiButtonBase-root {
        color: #bababa;
      }
    }
  }
  .folder-item-container {
    .MuiInputBase-root {
      max-width: 230px;
      .MuiSelect-select {
        padding: 7px 10px;
        padding-right: 32px;
        min-width: 40px;
      }
    }
    .folder-name-item {
      margin-left: 390px;
      margin-top: 10px;
      .MuiTextField-root {
        width: 230px;
      }
    }
  }
`

const ErrorMessage = styled.div`
  color: red;
  font-size: 10px;
  margin-left: 390px;
  margin-top: 5px;
`

const SaveButton = styled.div`
  text-align: center;
  margin-top: 25px;
  margin-bottom: 20px;
  .MuiButton-root {
    background-color: #20a1ff;
    font-size: 12px;
    padding: 6px 6px;
    &:hover {
      background-color: #178fe7;
    }
  }
`
