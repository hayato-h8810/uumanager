import FullCalendar, { EventApi, EventClickArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { MutableRefObject, useState } from 'react'
import styled from 'styled-components'
import { Modal } from '@mui/material'
import { useDeleteBrowsingHistoryMutation, Url } from '../../../api/graphql'

interface propType {
  calendarEvents: EventInput[] | undefined
  identifyUrl: (eventId: string) => Url | undefined
  setCurrentEvents: (event: EventApi[]) => void
  calendarRef: MutableRefObject<FullCalendar | null>
}

export default function Calendar({ props }: { props: propType }) {
  const { calendarEvents, identifyUrl, setCurrentEvents, calendarRef } = props
  const [deleteEventModal, setDeleteEventModal] = useState(false)
  const [deleteEvent, setDeleteEvent] = useState<EventClickArg | undefined>()
  const [slectedEvent, setSelectedEvent] = useState<Url | undefined>()
  const [deleteBrowsingHistoryMutation] = useDeleteBrowsingHistoryMutation({
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
    setDeleteEvent(clickInfo)
    const selectedUrl = identifyUrl(clickInfo.event.id)
    setSelectedEvent(selectedUrl)
    setDeleteEventModal(true)
  }
  const handleEvents = (events: EventApi[]) => {
    setCurrentEvents(events)
  }

  return (
    <>
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
          height={500}
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
                  deleteBrowsingHistoryMutation({ variables: { id: deleteEvent?.event.extendedProps.id as string } })
                }}
              >
                削除
              </button>
            </div>
          </div>
        </ModalContainer>
      </CalendarContainer>
      {(() => {
        const monthButtonArray = []
        for (let i = 1; i < 13; i += 1) {
          monthButtonArray.push(
            <>
              <br />
              <button
                type="button"
                key={`month${i}`}
                onClick={() => {
                  const currentYear = calendarRef.current?.getApi().getDate().getFullYear()
                  if (currentYear) {
                    const month = `0${i}`.slice(-2)
                    calendarRef.current?.getApi().gotoDate(new Date(`${currentYear}-0${month}`))
                  }
                }}
              >
                {i}月に移動
              </button>
            </>
          )
        }
        return monthButtonArray
      })()}
      {(() => {
        const yearButtonArray = []
        for (let i = 1; i < 13; i += 1) {
          const currentYear = new Date().getFullYear()
          if (currentYear) {
            const displayYear = currentYear - 6 + i
            yearButtonArray.push(
              <button
                key={`year${i}`}
                type="button"
                onClick={() => {
                  const month = calendarRef.current?.getApi().getDate().getMonth()
                  if (month) {
                    const currentMonth = `0${month + 1}`.slice(-2)
                    calendarRef.current?.getApi().gotoDate(new Date(`${displayYear}-${currentMonth}`))
                  }
                }}
              >
                {displayYear}
              </button>
            )
          }
        }
        return yearButtonArray
      })()}
    </>
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
