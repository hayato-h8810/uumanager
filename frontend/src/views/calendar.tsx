import FullCalendar, { EventClickArg, EventDropArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { useState } from 'react'
import styled from 'styled-components'
import { Modal } from '@mui/material'
import {
  useFetchFolderUrlQuery,
  useEditUrlMutation,
  useFetchVisitingHistoryQuery,
  useDeleteVisitingHistoryMutation,
  Url,
} from '../api/graphql'

export default function Calendar() {
  const [notificationEvents, setNotificationEvents] = useState<EventInput[]>()
  const [deleteEventModal, setDeleteEventModal] = useState(false)
  const [deleteEvent, setDeleteEvent] = useState<EventClickArg | undefined>()
  const [slectedEvent, setSelectedEvent] = useState<Url | undefined>()
  const { data: { fetchFolderUrl = null } = {} } = useFetchFolderUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      const INITIAL_EVENTS: EventInput[] = []
      fetchFolderUrl?.map((folder) =>
        folder.urls.map(
          (url) =>
            url.notification &&
            INITIAL_EVENTS.push({
              id: url.id,
              title: url.title ? url.title : 'no title',
              date: url.notification,
            })
        )
      )
      setNotificationEvents(INITIAL_EVENTS)
    },
  })
  const { data: { fetchVisitingHistory = null } = {} } = useFetchVisitingHistoryQuery({
    fetchPolicy: 'network-only',
    skip: !fetchFolderUrl,
    onCompleted: () => {
      const historys = fetchVisitingHistory?.map((data) => ({
        id: data.urlId,
        title: identifyNotificationEvent(data.urlId)?.title
          ? (identifyNotificationEvent(data.urlId)?.title as string)
          : 'no title',
        date: data.date,
        backgroundColor: 'red',
        borderColor: 'red',
        editable: false,
        extendedProps: { id: data.id },
      }))
      if (notificationEvents && historys) {
        setNotificationEvents([...notificationEvents, ...historys])
      } else if (!notificationEvents && historys) {
        setNotificationEvents(historys)
      }
    },
  })
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: () => {
      if (deleteEvent) {
        deleteEvent?.event.remove()
        setDeleteEvent(undefined)
        setSelectedEvent(undefined)
        setDeleteEventModal(false)
      }
    },
  })
  const [deleteVisitingHistoryMutation] = useDeleteVisitingHistoryMutation({
    onCompleted: () => {
      if (deleteEvent) {
        deleteEvent?.event.remove()
        setDeleteEvent(undefined)
        setSelectedEvent(undefined)
        setDeleteEventModal(false)
      }
    },
  })

  const identifyNotificationEvent = (eventId: string): Url | undefined =>
    fetchFolderUrl?.map((folder) => folder.urls.find((url) => url.id === eventId)).find((url) => url !== undefined)

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log(clickInfo.event.extendedProps.id)
    console.log(clickInfo.event.id)
    setDeleteEvent(clickInfo)
    const selectedUrl = identifyNotificationEvent(clickInfo.event.id)
    setSelectedEvent(selectedUrl)
    setDeleteEventModal(true)
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
      <ModalContainer open={deleteEventModal}>
        <div className="modalFrame">
          <div>
            <div>
              id: {slectedEvent?.id}
              <br />
              url: {slectedEvent?.url}
              <br />
              title: {slectedEvent?.title}
              <br />
              memo: {slectedEvent?.memo}
              <br />
              importance: {slectedEvent?.importance}
              <br />
              notification: {slectedEvent?.notification}
            </div>
            <button
              type="button"
              onClick={() => {
                if (deleteEvent?.event.extendedProps.id) {
                  deleteVisitingHistoryMutation({ variables: { id: deleteEvent?.event.extendedProps.id as string } })
                } else if (slectedEvent)
                  editUrlMutation({
                    variables: {
                      urlId: slectedEvent.id,
                      url: {
                        title: slectedEvent.title,
                        memo: slectedEvent.memo,
                        notification: null,
                        importance: slectedEvent.importance,
                        url: slectedEvent.url,
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
