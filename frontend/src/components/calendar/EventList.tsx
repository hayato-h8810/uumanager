import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'
import { MutableRefObject, useState, useEffect } from 'react'
import {
  useEditUrlMutation,
  useDeleteVisitingHistoryMutation,
  Url,
  FetchVisitingHistoryDocument,
} from '../../api/graphql'

interface propType {
  calendarEvents: EventInput[] | undefined
  identifyNotificationEvent: (eventId: string) => Url | undefined
  currentEvents: EventApi[]
  calendarRef: MutableRefObject<FullCalendar | null>
}

export default function EventList({ props }: { props: propType }) {
  const { calendarEvents, identifyNotificationEvent, calendarRef } = props
  const [selectedId, setSelectedId] = useState<string | null>()
  const [sortEvent, setSortEvent] = useState<EventInput[] | undefined>()
  const [sort, setSort] = useState(true)
  const [deleteVisitingHistoryMutation] = useDeleteVisitingHistoryMutation({
    onCompleted: () => {
      setSelectedId(null)
    },
    update(cache, { data }) {
      const newCache = data?.deleteVisitingHistory
      cache.writeQuery({
        query: FetchVisitingHistoryDocument,
        data: { fetchVisitingHistory: newCache },
      })
    },
  })
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: () => {
      setSelectedId(null)
    },
  })
  useEffect(() => {
    setSortEvent(
      calendarEvents?.sort((a, b) => {
        if (a?.date && b?.date) {
          console.log('a')
          return a?.date > b?.date ? 1 : -1
        }
        return 1
      })
    )
  }, [calendarEvents])
  console.log(sortEvent)
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setSort(!sort)
          if (!sort) {
            setSortEvent(
              calendarEvents?.sort((a, b) => {
                if (a?.date && b?.date) {
                  console.log('a')
                  return a?.date > b?.date ? 1 : -1
                }
                return 1
              })
            )
            console.log('sort')
          } else if (sort) {
            setSortEvent(
              calendarEvents?.sort((a, b) => {
                if (a?.date && b?.date) {
                  console.log('b')
                  return a?.date < b?.date ? 1 : -1
                }
                return 1
              })
            )
            console.log('sort reverse')
          }
        }}
      >
        {sort ? 'sort' : 'sort reverse'}
      </button>
      {sortEvent?.map((event) => (
        <div
          key={
            event.extendedProps?.id && event.id ? `history${(event.extendedProps?.id as string) + event.id}` : event.id
          }
        >
          {event.date}:{event.title}:{event.extendedProps?.id}
          <button
            type="button"
            key={
              event.extendedProps?.id && event.id
                ? `history${(event.extendedProps?.id as string) + event.id}`
                : event.id
            }
            onClick={() => {
              // 履歴を削除した場合
              if (event.extendedProps) {
                deleteVisitingHistoryMutation({ variables: { id: event.extendedProps.id as string } })
                setSelectedId(event.extendedProps.id as string)

                // 通知を削除した場合
              } else if (event.id) {
                setSelectedId(event.id)
                const selectedUrl = identifyNotificationEvent(event.id)
                if (selectedUrl)
                  editUrlMutation({
                    variables: {
                      urlId: selectedUrl.id,
                      url: {
                        title: selectedUrl.title,
                        memo: selectedUrl.memo,
                        notification: null,
                        importance: selectedUrl.importance,
                        url: selectedUrl.url,
                      },
                    },
                  })
              }
            }}
          >
            delete event
          </button>
          <button
            type="button"
            key={
              event.extendedProps?.id
                ? event.id && `goto-history${(event.extendedProps?.id as string) + event.id}`
                : event.id && `goto${event.id}`
            }
            onClick={() => {
              if (event.date) calendarRef.current?.getApi().gotoDate(new Date(event.date.toString()))
            }}
          >
            goto
          </button>
        </div>
      ))}
    </div>
  )
}
