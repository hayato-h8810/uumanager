import FullCalendar, { EventApi, EventClickArg, EventDropArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { MutableRefObject, useState } from 'react'
import styled from 'styled-components'
import { Modal } from '@mui/material'
import { useEditUrlMutation, useDeleteVisitingHistoryMutation, Url } from '../../api/graphql'

interface propType {
  calendarEvents: EventInput[] | undefined
  identifyNotificationEvent: (eventId: string) => Url | undefined
  setCurrentEvents: (event: EventApi[]) => void
  calendarRef: MutableRefObject<FullCalendar | null>
}

export default function CalendarComponent({ props }: { props: propType }) {
  const { calendarEvents, identifyNotificationEvent, setCurrentEvents, calendarRef } = props
  const [deleteEventModal, setDeleteEventModal] = useState(false)
  const [deleteEvent, setDeleteEvent] = useState<EventClickArg | undefined>()
  const [slectedEvent, setSelectedEvent] = useState<Url | undefined>()
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
  const handleEvents = (events: EventApi[]) => setCurrentEvents(events)

  return (
    <CalendarContainer>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable
        events={calendarEvents}
        locales={allLocales}
        locale="ja"
        eventClick={handleEventClick}
        eventsSet={handleEvents}
        dayMaxEventRows={2}
        droppable
        height={500}
        eventDrop={handleEventDrop}
        ref={calendarRef}
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
