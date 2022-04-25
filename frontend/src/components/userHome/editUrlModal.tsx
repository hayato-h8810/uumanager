import { Modal, TextField, MenuItem, Button, IconButton, Rating, Select, FormControl, InputLabel } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
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
  title: string | null
  memo: string | null
  notification: string | null
  folderId: string | null
}

interface propsType {
  editUrlModalOpen: boolean
  setEditUrlModalOpen: (boolean: boolean) => void
  urlId: string
}

export default function EditUrlModal({ props }: { props: propsType }) {
  const { editUrlModalOpen, setEditUrlModalOpen, urlId } = props
  const [specificUrl, setSpecificUrl] = useState<Url>()
  const [notificationValue, setNotificationValue] = useState<Date | null>(null)
  const [importanceValue, setImportanceValue] = useState<number | undefined | null>()
  const [folderId, setFolderId] = useState('')
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    onCompleted: (data) => {
      const detectedUrl = data.fetchFolderAndUrl
        ?.map((folder) => folder.urls.find((url) => url.id === urlId))
        .find((url) => url)
      if (detectedUrl) {
        setSpecificUrl(detectedUrl)
      }
    },
  })
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: () => {
      setEditUrlModalOpen(false)
      setNotificationValue(null)
      setImportanceValue(null)
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

  useEffect(() => {
    if (specificUrl?.notification) {
      setNotificationValue(new Date(specificUrl?.notification))
    }
    if (specificUrl?.folderId) {
      setFolderId(specificUrl?.folderId)
    }
    setImportanceValue(specificUrl?.importance)
  }, [specificUrl, editUrlModalOpen])

  const onEditUrlSubmit: SubmitHandler<FormInput> = (data) => {
    if (importanceValue) {
      editUrlMutation({
        variables: {
          urlId,
          folderId: data.folderId === specificUrl?.folderId ? null : data.folderId,
          url: {
            url: data.url,
            importance: importanceValue,
            title: data.title === '' ? null : data.title,
            memo: data.memo === '' ? null : data.memo,
            notification: notificationValue ? format(notificationValue, 'yyyy-MM-dd') : null,
          },
        },
      })
    }
  }

  return (
    <ModalContainer open={editUrlModalOpen}>
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
                    console.log(newValue)
                  }}
                />
              </div>
            </div>
            <div className="item-container multiline-item-container">
              <div className="label">タイトル</div>
              <TextField
                {...register('title')}
                defaultValue={specificUrl?.title}
                type="text"
                label="タイトル"
                variant="outlined"
                multiline
                size="small"
                rows={4}
              />
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
                  onChange={(e) => setFolderId(e.target.value)}
                  value={folderId}
                  label="フォルダー"
                  variant="outlined"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxWidth: '230px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
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
                  {fetchFolderAndUrl?.map((folder) => (
                    <MenuItem value={folder.id} key={folder.id}>
                      {folder.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

const ModalContainer = styled(Modal)`
  position: relative;
  .MuiBackdrop-root {
    background: rgba(0, 0, 0, 0.7);
  }
  .modal-frame {
    background: white;
    max-height: 100%;
    max-width: 100%;
    height: 720px;
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
  }
  .oneline-item-container {
    .MuiInputLabel-root {
      top: -3px;
      font-size: 12px;
    }
    .MuiInputBase-root {
      font-size: 12px;
      .MuiInputBase-input {
        padding: 7px 10px;
      }
    }
  }
  .notification-item-container .MuiTextField-root {
    width: 140px;
  }
  .folder-item-container .MuiInputBase-root {
    max-width: 230px;
    .MuiSelect-select {
      padding: 7px 10px;
      padding-right: 32px;
      min-width: 40px;
      font-size: 12px;
    }
  }
  .multiline-item-container .MuiTextField-root {
    width: 230px;
    .MuiInputBase-inputMultiline {
      font-size: 12px;
      -ms-overflow-style: none;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
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
    font-size: 12px;
    padding: 6px 6px;
    &:hover {
      background-color: #178fe7;
    }
  }
`
