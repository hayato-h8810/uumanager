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
import { useEffect, useState } from 'react'
import { useEditUrlMutation, useFetchFolderAndUrlQuery, Url } from '../../api/graphql'

type FormInput = {
  url: string
  title: string
  memo: string | null
  notification: string | null
  folderId: string | null
  newFolderName: string | null
}

interface propsType {
  editUrlModalOpen: boolean
  setEditUrlModalOpen: (boolean: boolean) => void
  urlId: string
}

type ModalContainerProps = {
  folderNameDisable?: boolean
}

export default function EditUrlModal({ props }: { props: propsType }) {
  const { editUrlModalOpen, setEditUrlModalOpen, urlId } = props
  const [specificUrl, setSpecificUrl] = useState<Url>()
  const [notificationValue, setNotificationValue] = useState<Date | null>(null)
  const [importanceValue, setImportanceValue] = useState<number | undefined | null>(0)
  const [folderId, setFolderId] = useState('new')
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
  })
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: () => {
      setEditUrlModalOpen(false)
      setNotificationValue(null)
      setImportanceValue(0)
      setFolderId('')
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

  useEffect(() => {
    const detectedUrl = fetchFolderAndUrl
      ?.map((folder) => folder.urls.find((url) => url.id === urlId))
      .find((url) => url)
    if (detectedUrl && editUrlModalOpen) {
      setSpecificUrl(detectedUrl)
      setImportanceValue(detectedUrl.importance)
      if (detectedUrl.notification) {
        setNotificationValue(new Date(detectedUrl.notification))
      }
      if (detectedUrl.folderId) {
        setFolderId(detectedUrl.folderId)
      }
    }
  }, [editUrlModalOpen])

  const onEditUrlSubmit: SubmitHandler<FormInput> = (data) => {
    if (importanceValue || importanceValue === 0) {
      editUrlMutation({
        variables: {
          urlId,
          folderId: data.folderId === specificUrl?.folderId || data.folderId === 'new' ? null : data.folderId,
          newFolderName: data.newFolderName ? data.newFolderName : null,
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
  }

  return (
    <ModalContainer open={editUrlModalOpen} folderNameDisable={folderId !== 'new'}>
      <div className="modal-frame">
        <HeadLine>
          <div className="title">
            {specificUrl?.title && specificUrl?.title?.length > 15
              ? `${specificUrl?.title?.substr(0, 15)}...`
              : specificUrl?.title}
            の編集
          </div>
          <Button
            onClick={() => {
              if (specificUrl?.folderId) {
                setFolderId(specificUrl?.folderId)
              }
              if (specificUrl?.notification) {
                setNotificationValue(new Date(specificUrl?.notification))
              } else {
                setNotificationValue(null)
              }
              setImportanceValue(specificUrl?.importance)
              reset()
            }}
            variant="outlined"
            size="small"
          >
            リセット
          </Button>
          <IconButton
            onClick={() => {
              setEditUrlModalOpen(false)
              setNotificationValue(null)
              setImportanceValue(null)
              setFolderId('')
              reset()
            }}
          >
            <CloseIcon />
          </IconButton>
        </HeadLine>
        <Contents>
          <form onSubmit={handleSubmit(onEditUrlSubmit)}>
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
                defaultValue={specificUrl?.title}
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
                defaultValue={specificUrl?.url}
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
                    clearErrors('newFolderName')
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
                    {...register('newFolderName', { validate: (value) => !(value === '' && folderId === 'new') })}
                    type="text"
                    label="フォルダー"
                    variant="outlined"
                    size="small"
                    disabled={folderId !== 'new'}
                  />
                </div>
              )}
              {errors.newFolderName && <ErrorMessage>フォルダー名を入力して下さい。</ErrorMessage>}
            </div>
            <div className="item-container multiline-item-container">
              <div className="label">コメント</div>
              <TextField
                {...register('memo')}
                defaultValue={specificUrl?.memo}
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
    margin-left: 110px;
    font-size: 14px;
    padding: 0px 8px;
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
  margin-top: 30px;
  margin-bottom: 10px;
  .MuiButton-root {
    background-color: #20a1ff;
    font-size: 14px;
    padding: 2px 8px;
    &:hover {
      background-color: #178fe7;
    }
  }
`
