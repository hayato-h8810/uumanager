import FullCalendar, { EventClickArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { MutableRefObject, useState } from 'react'
import styled from 'styled-components'
import { Button, Popover } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useDeleteBrowsingHistoryMutation, Url, FetchBrowsingHistoryDocument } from '../../../api/graphql'
import MonthsAndYearsList from '../monthsAndYearsrList'

interface propType {
  calendarEvents: EventInput[] | undefined
  identifyUrl: (eventId: string) => Url | undefined
  calendarRef: MutableRefObject<FullCalendar | null>
  selectedId: string | null | undefined
  setSelectedId: (id: string | null | undefined) => void
  setEventClick: (boolean: boolean) => void
}

export default function Calendar({ props }: { props: propType }) {
  const { calendarEvents, calendarRef, selectedId, setSelectedId, setEventClick } = props
  const [calendarCurrent, setCalendarCurrent] = useState<Date>()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const history = useHistory()
  const open = Boolean(anchorEl)
  const [deleteBrowsingHistoryMutation] = useDeleteBrowsingHistoryMutation({
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
    setEventClick(true)
    setAnchorEl(clickInfo.el)
  }
  const detectUrlFromBrowsingHistoryId = (events: EventInput[] | undefined, browsingHistoryId: string) =>
    events?.find((event) => event.extendedProps?.id === browsingHistoryId)

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
        <PopoverContainer
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          {selectedId && (
            <div className="item-container">
              <div className="title-item">{detectUrlFromBrowsingHistoryId(calendarEvents, selectedId)?.title}</div>
              <div className="notification-item">{`閲覧日 : ${
                detectUrlFromBrowsingHistoryId(calendarEvents, selectedId)?.date as string
              }`}</div>
              <Button
                onClick={() =>
                  history.push(
                    `/userHome/urlShow/${detectUrlFromBrowsingHistoryId(calendarEvents, selectedId)?.id as string}`
                  )
                }
              >
                詳細ページへ
              </Button>
              <Button
                onClick={() => {
                  deleteBrowsingHistoryMutation({
                    variables: {
                      id: selectedId,
                    },
                  })
                  setAnchorEl(null)
                }}
              >
                履歴を削除
              </Button>
            </div>
          )}
        </PopoverContainer>
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

const PopoverContainer = styled(Popover)`
  .item-container {
    height: 200px;
    width: 250px;
    background: #f4f9ff;
    font-size: 14px;
    text-align: center;
    .title-item {
      font-size: 20px;
      max-width: 180px;
      margin: auto;
      padding-top: 30px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .notification-item {
      color: #626262;
      padding-top: 20px;
    }
    .MuiButton-root {
      margin-top: 40px;
    }
  }
`
