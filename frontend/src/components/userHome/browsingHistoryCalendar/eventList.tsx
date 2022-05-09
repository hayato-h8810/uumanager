import FullCalendar, { EventInput } from '@fullcalendar/react'
import { Select, MenuItem } from '@mui/material'
import { MutableRefObject, useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useDeleteBrowsingHistoryMutation, FetchBrowsingHistoryDocument } from '../../../api/graphql'

interface propType {
  calendarEvents: EventInput[] | undefined
  calendarRef: MutableRefObject<FullCalendar | null>
  selectedId: string | null | undefined
  setSelectedId: (id: string | null | undefined) => void
  eventClick: boolean
}

export default function EventList({ props }: { props: propType }) {
  const { calendarEvents, calendarRef, selectedId, setSelectedId, eventClick } = props
  const [isListClick, setIsListClick] = useState(false)
  const [sortedEvents, setSortedEvents] = useState<EventInput[] | undefined>()
  const [sort, setSort] = useState('new')
  const eventListRef = useRef<HTMLDivElement>(null)
  const history = useHistory()
  const [deleteBrowsingHistoryMutation] = useDeleteBrowsingHistoryMutation({
    onCompleted: () => {
      setSelectedId(null)
    },
    update(cache, { data }) {
      const newCache = data?.deleteBrowsingHistory
      cache.writeQuery({
        query: FetchBrowsingHistoryDocument,
        data: { fetchBrowsingHistory: newCache },
      })
    },
  })

  useEffect(() => {
    if (calendarEvents) {
      const copyArray = [...calendarEvents]
      if (sort === 'new') {
        setSortedEvents(
          copyArray.sort((a, b) => {
            if (a?.date && b?.date) {
              return a?.date < b?.date ? 1 : -1
            }
            return 1
          })
        )
      } else if (sort === 'old') {
        setSortedEvents(
          copyArray.sort((a, b) => {
            if (a?.date && b?.date) {
              return a?.date > b?.date ? 1 : -1
            }
            return 1
          })
        )
      }
    }
  }, [calendarEvents, sort])
  useEffect(() => {
    if (calendarEvents && !selectedId) {
      const copyArray = [...calendarEvents]
      setSelectedId(
        copyArray.sort((a, b) => {
          if (a?.date && b?.date) {
            return a?.date < b?.date ? 1 : -1
          }
          return 1
        })[0].extendedProps?.id as string
      )
    }
  }, [calendarEvents])
  useEffect(() => {
    if (!isListClick && sortedEvents) {
      const selectedItemLocation = sortedEvents.findIndex((event) => event.extendedProps?.id === selectedId)
      eventListRef.current?.scrollTo(0, (selectedItemLocation - 2) * 80 + selectedItemLocation - 2)
    }
    setIsListClick(false)
  }, [selectedId, sortedEvents, eventClick])

  return (
    <Container>
      <Title>閲覧履歴一覧</Title>
      <Sort>
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          variant="standard"
          MenuProps={{
            PaperProps: {
              sx: {
                '& .MuiMenuItem-root': {
                  fontSize: '12px',
                  paddingLeft: '10px',
                  '& .place-holder': {
                    paddingLeft: '10px',
                  },
                },
                '& .MuiCheckbox-root': {
                  paddingTop: 0,
                  paddingBottom: 0,
                },
                '& .MuiTypography-root': {
                  fontSize: '14px',
                },
                '& .MuiSvgIcon-root': {
                  fontSize: '18px',
                },
              },
            },
          }}
        >
          <MenuItem value="new">新しい順</MenuItem>
          <MenuItem value="old">古い順</MenuItem>
        </Select>
      </Sort>
      <List ref={eventListRef}>
        {sortedEvents ? (
          sortedEvents.map((event, i) => (
            <div
              onClick={() => {
                if (event.date) calendarRef.current?.getApi().gotoDate(new Date(event.date.toString()))
                setSelectedId(event.extendedProps?.id as string)
                setIsListClick(true)
              }}
              className={(() => {
                if (selectedId === event.extendedProps?.id) {
                  if (sortedEvents.length === i + 1) {
                    return 'last-item-container selected-item-container item-container'
                  }
                  return 'selected-item-container item-container'
                }
                return 'item-container'
              })()}
              key={event.extendedProps?.id as string}
              role="button"
              tabIndex={0}
            >
              <div className="date-item" key={event.id && `date-${event.extendedProps?.id as string}`}>
                {event.date &&
                  `${event.date.toString().substr(0, 4)}年${event.date.toString().substr(5, 2)}月${event.date
                    .toString()
                    .substr(8, 2)}日`}
              </div>
              <div
                onClick={() => {
                  if (event.id) history.push(`/userHome/urlShow/${event.id}`)
                }}
                className="title-item"
                key={event.id && `title-${event.extendedProps?.id as string}`}
                role="button"
                tabIndex={0}
              >
                {event.title}
              </div>
            </div>
          ))
        ) : (
          <div className="no-item-container">
            <div className="no-item">閲覧履歴がありません。</div>
          </div>
        )}
      </List>
    </Container>
  )
}

const Container = styled.div`
  grid-area: eventList;
  margin-left: 100px;
  margin-top: 60px;
  position: relative;
  &::before {
    content: '';
    background: #ddd;
    width: 1px;
    height: 548px;
    position: absolute;
    left: 420px;
    top: -25px;
  }
`

const Title = styled.div`
  font-size: 20px;
  display: inline-block;
  margin-left: 35px;
  vertical-align: top;
`

const Sort = styled.div`
  display: inline-block;
  margin-left: 75px;
  margin-top: 10px;
  .MuiInputBase-root .MuiSelect-select {
    font-size: 14px;
    padding: 2px;
    padding-left: 10px;
    color: #8a8a8a;
  }
`

const List = styled.div`
  max-height: 405px;
  margin-top: 20px;
  width: 350px;
  overflow: auto;
  position: relative;
  border-top: 1px solid #b8b8b8;
  border-bottom: 1px solid #b8b8b8;
  .item-container {
    height: 80px;
    border-bottom: 1px solid #b8b8b8;
    overflow: hidden;
    font-size: 14px;
    &:hover {
      background: #fafafa;
    }
    .date-item {
      margin-top: 10px;
      margin-left: 50px;
      color: #676767;
    }
    .title-item {
      margin-top: 5px;
      margin-left: 50px;
      cursor: pointer;
      max-width: 260px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      &:hover {
        color: blue;
        text-decoration: underline;
      }
    }
  }
  .selected-item-container {
    background: #fafafa;
    position: relative;
    &::before {
      content: '';
      width: 7px;
      height: 80px;
      background: #3bff37;
      position: absolute;
      top: 0;
    }
  }
  .last-item-container {
    border-bottom: none;
  }
  .no-item-container {
    height: 80px;
    color: #8a8a8a;
    text-align: center;
    font-size: 14px;
    .no-item {
      padding-top: 30px;
    }
  }
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background: #dadada;
    border-radius: 10px;
  }
`
