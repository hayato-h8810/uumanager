import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import ClearIcon from '@mui/icons-material/Clear'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import { useHistory } from 'react-router-dom'
import { useFetchFolderAndUrlQuery, Url, useEditUrlMutation } from '../api/graphql'

type BalloonContainerProps = {
  anchorElLeft: number | undefined
  anchorElTop: number | undefined
}

export default function Notification() {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [displayNotifications, setDisplayNotifications] = useState<Url[]>([])
  const history = useHistory()
  useFetchFolderAndUrlQuery({
    onCompleted: (data) => {
      const notificationsArray: Url[] = []
      data.fetchFolderAndUrl?.map((folderdata) => {
        const notifyData = folderdata.urls?.filter(
          (urldata) => urldata.notification && urldata.notification <= format(today(), 'yyyy-MM-dd')
        )
        return notificationsArray.push(...notifyData)
      })
      setDisplayNotifications(notificationsArray.sort((a, b) => Number(b.id) - Number(a.id)))
    },
  })
  const [editUrlMutation] = useEditUrlMutation()
  const today = () => {
    const tz = (new Date().getTimezoneOffset() + 540) * 60 * 1000
    return new Date(new Date().getTime() + tz)
  }

  return (
    <>
      <NotificationIconContainer>
        <IconButton
          onClick={(e) => {
            setAnchorEl(e.currentTarget)
          }}
          className={displayNotifications.length ? '' : 'notification-icon-no-item'}
        >
          <NotificationsNoneIcon />
        </IconButton>
      </NotificationIconContainer>
      {anchorEl && (
        <BackdropContainer
          onClick={() => {
            setAnchorEl(null)
          }}
        >
          <BalloonContainer
            anchorElLeft={anchorEl?.getBoundingClientRect().left}
            anchorElTop={anchorEl?.getBoundingClientRect().bottom}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="balloon-item-frame">
              {displayNotifications.length ? (
                <>
                  <Header>
                    <div className="header-item-title">通知</div>
                  </Header>
                  <NotificationList>
                    {displayNotifications.map((url) => (
                      <div className="notification-list-item" key={url.id}>
                        <div className="notification-list-item-date" key={`date-${url.id}`}>
                          {url.notification}
                        </div>
                        <IconButton
                          onClick={() => {
                            editUrlMutation({
                              variables: {
                                urlId: url.id,
                                url: {
                                  title: url.title,
                                  memo: url.memo,
                                  notification: null,
                                  importance: url.importance,
                                  url: url.url,
                                },
                              },
                            })
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                        <br />
                        <div
                          onClick={() => {
                            history.push(`/userHome/urlShow/${url.id}`)
                            setAnchorEl(null)
                          }}
                          className="notification-list-item-title"
                          role="button"
                          tabIndex={0}
                          key={`title-${url.id}`}
                        >
                          {url.title}
                        </div>
                      </div>
                    ))}
                  </NotificationList>
                </>
              ) : (
                <div className="balloon-item-no-notification">通知がありません。</div>
              )}
            </div>
          </BalloonContainer>
        </BackdropContainer>
      )}
    </>
  )
}

const NotificationIconContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 300px;
  .MuiIconButton-root {
    .MuiSvgIcon-root {
      color: white;
    }
    &::before {
      position: absolute;
      top: 9px;
      left: 21px;
      content: '';
      border-radius: 50%;
      width: 10px;
      height: 10px;
      background: #00ff0a;
      z-index: 1;
    }
    &:hover {
      .MuiSvgIcon-root {
        color: #c8c8c8;
      }
      &::before {
        background: #09bd46;
      }
    }
  }
  .notification-icon-no-item {
    &::before {
      content: none;
    }
  }
`

const BackdropContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
`

const BalloonContainer = styled.div<BalloonContainerProps>`
  position: absolute;
  left: ${(props) => props.anchorElLeft}px;
  top: ${(props) => props.anchorElTop && props.anchorElTop + 10}px;
  z-index: 2000;
  font-size: 14px;
  .balloon-item-frame {
    position: relative;
    width: 200px;
    background: white;
    box-shadow: 0px 2px 20px -7px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    border: 1px solid #c5c5c5;
    padding-right: 3px;
    &::before {
      position: absolute;
      top: -20px;
      left: 10px;
      content: '';
      border: 10px solid transparent;
      border-bottom: 10px solid #c5c5c5;
    }
    &::after {
      position: absolute;
      top: -18px;
      left: 10px;
      content: '';
      border: 10px solid transparent;
      border-bottom: 10px solid white;
    }
  }
  .balloon-item-no-notification {
    color: #777;
    padding: 20px 37px;
  }
`

const Header = styled.div`
  .header-item-title {
    color: #777;
    margin-left: 20px;
    margin-top: 10px;
    margin-bottom: 8px;
  }
`

const NotificationList = styled.div`
  max-height: 252px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #ededed;
    border-radius: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #cecece;
    border-radius: 8px;
  }
  .notification-list-item {
    position: relative;
    border: 1px solid #c5c5c5;
    margin: 7px;
    margin-top: 0;
    margin-right: 3px;
    padding: 5px 14px;
    border-radius: 3px;
    .notification-list-item-date {
      display: inline-block;
      color: #777;
      font-size: 12px;
    }
    .MuiIconButton-root {
      position: absolute;
      padding: 5px;
      top: 2px;
      left: 153px;
      .MuiSvgIcon-root {
        font-size: 16px;
        color: #777;
      }
    }
    .notification-list-item-title {
      display: inline-block;
      max-width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: #2b40ff;
        text-decoration: underline;
      }
    }
  }
`
