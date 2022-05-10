import FullCalendar, { EventClickArg, EventDropArg, EventInput } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import allLocales from '@fullcalendar/core/locales-all'
import interactionPlugin from '@fullcalendar/interaction'
import { MutableRefObject, useState } from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import { Button, Popover } from '@mui/material'
import { useHistory } from 'react-router-dom'
import { useEditUrlMutation, Url } from '../../../api/graphql'
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
  const { calendarEvents, identifyUrl, calendarRef, selectedId, setSelectedId, setEventClick } = props
  const [calendarCurrent, setCalendarCurrent] = useState<Date>()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [editUrlMutation] = useEditUrlMutation()
  const history = useHistory()
  const open = Boolean(anchorEl)
  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedId(clickInfo.event.id)
    setEventClick(true)
    setAnchorEl(clickInfo.el)
  }
  const handleEventDrop = (eventDropInfo: EventDropArg) => {
    const editNotificationUrl = identifyUrl(eventDropInfo.event.id)
    if (editNotificationUrl)
      editUrlMutation({
        variables: {
          urlId: editNotificationUrl.id,
          url: {
            title: editNotificationUrl.title,
            memo: editNotificationUrl.memo,
            notification: eventDropInfo.event.startStr,
            importance: editNotificationUrl.importance,
            url: editNotificationUrl.url,
          },
        },
      })
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
          droppable
          height={530}
          eventDrop={handleEventDrop}
          ref={calendarRef}
          eventAllow={(dropInfo) => format(dropInfo.start, 'yyyy-MM-dd') >= format(new Date(), 'yyyy-MM-dd')}
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
              <div className="title-item">{identifyUrl(selectedId)?.title}</div>
              <div className="notification-item">{`通知日 : ${identifyUrl(selectedId)?.notification as string}`}</div>
              <Button onClick={() => history.push(`/userHome/urlShow/${selectedId}`)}>詳細ページへ</Button>
              <Button
                onClick={() => {
                  const deleteNotificationUrl = identifyUrl(selectedId)
                  if (deleteNotificationUrl)
                    editUrlMutation({
                      variables: {
                        urlId: deleteNotificationUrl.id,
                        url: {
                          title: deleteNotificationUrl.title,
                          memo: deleteNotificationUrl.memo,
                          notification: null,
                          importance: deleteNotificationUrl.importance,
                          url: deleteNotificationUrl.url,
                        },
                      },
                    })
                  setAnchorEl(null)
                }}
              >
                通知を削除
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
