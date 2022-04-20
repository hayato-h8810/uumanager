import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import { FetchFolderAndUrlQuery, Url } from '../../../api/graphql'

interface propsType {
  fetchFolderAndUrl: FetchFolderAndUrlQuery['fetchFolderAndUrl']
}

export default function Notification({ props }: { props: propsType }) {
  const { fetchFolderAndUrl } = props
  const [notificationOpen, setNotificationOpen] = useState(false)
  const today = () => {
    const tz = (new Date().getTimezoneOffset() + 540) * 60 * 1000
    return new Date(new Date().getTime() + tz)
  }

  return (
    <NotificationContainer>
      <IconButton onClick={() => setNotificationOpen(!notificationOpen)}>
        <NotificationsNoneIcon />
      </IconButton>
      {(() => {
        const notifyDatasArray: Url[] = []
        fetchFolderAndUrl?.map((folderdata) => {
          const notifyData = folderdata.urls?.filter(
            (urldata) => urldata.notification && urldata.notification <= format(today(), 'yyyy-MM-dd')
          )
          return notifyDatasArray.push(...notifyData)
        })
        if (notificationOpen && notifyDatasArray.length) {
          return (
            <Notifications onClick={() => setNotificationOpen(!notificationOpen)}>
              {notifyDatasArray.map((data) => (
                <div key={data.id}>
                  {data.url}:{data.notification}
                </div>
              ))}
            </Notifications>
          )
        }
        if (notificationOpen && !notifyDatasArray.length) {
          return (
            <Notifications onClick={() => setNotificationOpen(!notificationOpen)}>
              <div>no nofitications</div>
            </Notifications>
          )
        }
        return null
      })()}
    </NotificationContainer>
  )
}

const NotificationContainer = styled.div`
  position: relative;
`

const Notifications = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  z-index: 1;
`
