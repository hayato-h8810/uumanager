import FullCalendar, { EventClickArg, EventDropArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { useState } from 'react'
import styled from 'styled-components'
import { Modal } from '@mui/material'
import { useFetchFolderUrlQuery, useEditUrlMutation, Url } from '../api/graphql'

export default function Calendar() {
  const [notificationEvents, setNotificationEvents] = useState<EventInput[]>()
  const [deleteNotificationModal, setDeleteNotificationModal] = useState(false)
  const [deleteEvent, setDeleteEvent] = useState<EventClickArg | undefined>()
  const [deletedNotification, setDeletedNotification] = useState<Url | undefined>()
  const { data: { fetchFolderUrl = null } = {} } = useFetchFolderUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      const INITIAL_EVENTS: EventInput[] = []
      fetchFolderUrl?.map((folder) =>
        folder.urls.map(
          (url) =>
            url.notification &&
            INITIAL_EVENTS.push({ id: url.id, title: url.title ? url.title : 'no title', date: url.notification })
        )
      )
      setNotificationEvents(INITIAL_EVENTS)
    },
  })
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: () => {
      if (deleteEvent) {
        deleteEvent?.event.remove()
        setDeleteEvent(undefined)
        setDeletedNotification(undefined)
        setDeleteNotificationModal(false)
      }
    },
  })
  const identifyNotificationEvent = (eventId: string): Url | undefined =>
    fetchFolderUrl?.map((folder) => folder.urls.find((url) => url.id === eventId)).find((url) => url !== undefined)
  const handleEventClick = (clickInfo: EventClickArg) => {
    setDeleteEvent(clickInfo)
    const deleteUrl = identifyNotificationEvent(clickInfo.event.id)
    setDeletedNotification(deleteUrl)
    setDeleteNotificationModal(true)
  }
  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    const deleteUrl = identifyNotificationEvent(eventDropInfo.event.id)
    if (deleteUrl)
      editUrlMutation({
        variables: {
          urlId: deleteUrl.id,
          url: {
            title: deleteUrl.title,
            memo: deleteUrl.memo,
            notification: eventDropInfo.event.startStr,
            importance: deleteUrl.importance,
            url: deleteUrl.url,
          },
        },
      })
  }

  return (
    <CalendarContainer>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable
        events={notificationEvents}
        locales={allLocales}
        locale="ja"
        eventClick={handleEventClick}
        dayMaxEventRows={2}
        droppable
        height={500}
        eventDrop={handleEventDrop}
      />
      <ModalContainer open={deleteNotificationModal}>
        <div className="modalFrame">
          <div>
            <div>
              id: {deletedNotification?.id}
              <br />
              url: {deletedNotification?.url}
              <br />
              title: {deletedNotification?.title}
              <br />
              memo: {deletedNotification?.memo}
              <br />
              importance: {deletedNotification?.importance}
              <br />
              notification: {deletedNotification?.notification}
            </div>
            <button
              type="button"
              onClick={() => {
                if (deletedNotification)
                  editUrlMutation({
                    variables: {
                      urlId: deletedNotification.id,
                      url: {
                        title: deletedNotification.title,
                        memo: deletedNotification.memo,
                        notification: null,
                        importance: deletedNotification.importance,
                        url: deletedNotification.url,
                      },
                    },
                  })
              }}
            >
              通知を削除
            </button>
          </div>
        </div>
      </ModalContainer>
    </CalendarContainer>
  )
}

const CalendarContainer = styled.div`
  width: 500px;
  .fc h2 {
    font-size: 5px;
  }
  .fc-today-button {
    font-size: 5px;
  }
  .fc .fc-icon {
    font-size: 5px;
    padding-bottom: 18px;
    padding-right: 10px;
  }
  .fc .fc-button-group .fc-button {
    padding: 0.1em 0.3em;
  }
  .fc thead {
    font-size: 5px;
  }
  .fc tbody {
    font-size: 3px;
    .fc-daygrid-day-events {
      position: absolute;
      min-width: 100%;
      .fc-event-title {
        font-size: 5px;
      }
    }
  }
`

const ModalContainer = styled(Modal)`
  background: rgba(0, 0, 0, 0.7);
  .modalFrame {
    background: white;
  }
`
