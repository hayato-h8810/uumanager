import FullCalendar, { EventClickArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { MutableRefObject, useState } from 'react'
import styled from 'styled-components'
import { useDeleteBrowsingHistoryMutation, Url, FetchBrowsingHistoryDocument } from '../../../api/graphql'
import MonthsAndYearsList from '../monthsAndYearsrList'

interface propType {
  calendarEvents: EventInput[] | undefined
  identifyUrl: (eventId: string) => Url | undefined
  calendarRef: MutableRefObject<FullCalendar | null>
  setSelectedId: (id: string | null | undefined) => void
  eventClick: boolean
  setEventClick: (boolean: boolean) => void
}

export default function Calendar({ props }: { props: propType }) {
  const { calendarEvents, identifyUrl, calendarRef, setSelectedId, eventClick, setEventClick } = props
  const [calendarCurrent, setCalendarCurrent] = useState<Date>()
  const [deleteEvent, setDeleteEvent] = useState<EventClickArg | undefined>()
  const [deleteBrowsingHistoryMutation] = useDeleteBrowsingHistoryMutation({
    onCompleted: () => {
      if (deleteEvent) {
        deleteEvent?.event.remove()
        setDeleteEvent(undefined)
      }
    },
    update(cache, { data }) {
      const newCache = data?.deleteBrowsingHistory
      cache.writeQuery({
        query: FetchBrowsingHistoryDocument,
        data: { fetchBrowsingHistory: newCache },
      })
    },
  })

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedId(clickInfo.event.extendedProps.id as string)
    setEventClick(!eventClick)
  }

  return (
    <Container>
      <CalendarContainer>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable
          events={calendarEvents}
          locales={allLocales}
          locale="ja"
          eventClick={handleEventClick}
          dayMaxEventRows={2}
          height={530}
          ref={calendarRef}
          buttonText={{
            today: 'today',
          }}
          datesSet={(datesSetArg) => {
            setCalendarCurrent(datesSetArg.view.calendar.getDate())
          }}
        />
      </CalendarContainer>
      <MonthsAndYearsList props={{ calendarRef, calendarCurrent }} />
    </Container>
  )
}

const Container = styled.div`
  grid-area: calendar;
`

const CalendarContainer = styled.div`
  width: 550px;
  margin-top: 35px;
  display: inline-block;
  vertical-align: top;
  position: relative;
  .fc-header-toolbar {
    .fc-toolbar-title {
      font-size: 20px;
      margin-left: 40px;
    }
    .fc-today-button {
      font-size: 12px;
      position: absolute;
      top: 12px;
      left: 611px;
    }
    .fc-button-group {
      position: absolute;
      top: 12px;
      left: 472px;
      .fc-button {
        padding: 0px 3px;
        .fc-icon {
          font-size: 18px;
          padding-bottom: 23px;
        }
        &:focus {
          box-shadow: none;
        }
      }
    }
  }
  .fc-view-harness {
    margin-top: 5px;
    font-size: 12px;
    thead {
    }
    tbody {
      .fc-daygrid-day-events {
        .fc-event-title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .fc-popover .fc-popover-body {
      .fc-event-title {
        max-width: 190px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`
