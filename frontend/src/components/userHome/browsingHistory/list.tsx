import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'
import { MutableRefObject, useState, useEffect } from 'react'
import { useDeleteBrowsingHistoryMutation, FetchBrowsingHistoryDocument } from '../../../api/graphql'

interface propType {
  calendarEvents: EventInput[] | undefined
  currentEvents: EventApi[]
  calendarRef: MutableRefObject<FullCalendar | null>
}

export default function List({ props }: { props: propType }) {
  const { calendarEvents, calendarRef } = props
  const [selectedId, setSelectedId] = useState<string | null>()
  const [sortEvent, setSortEvent] = useState<EventInput[] | undefined>()
  const [sort, setSort] = useState(true)
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
    setSortEvent(
      calendarEvents?.sort((a, b) => {
        if (a?.date && b?.date) {
          return a?.date > b?.date ? 1 : -1
        }
        return 1
      })
    )
  }, [calendarEvents])

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
                  return a?.date > b?.date ? 1 : -1
                }
                return 1
              })
            )
          } else if (sort) {
            setSortEvent(
              calendarEvents?.sort((a, b) => {
                if (a?.date && b?.date) {
                  return a?.date < b?.date ? 1 : -1
                }
                return 1
              })
            )
          }
        }}
      >
        {sort ? 'sort' : 'sort reverse'}
      </button>
      {sortEvent?.map((event) => (
        <div key={event.extendedProps?.id as string}>
          {event.date}:{event.title}:{event.extendedProps?.id}
          <button
            type="button"
            key={`delete-${event.extendedProps?.id as string}`}
            onClick={() => {
              if (event.extendedProps) {
                deleteBrowsingHistoryMutation({ variables: { id: event.extendedProps.id as string } })
                setSelectedId(event.extendedProps.id as string)
              }
            }}
          >
            delete event
          </button>
          <button
            type="button"
            key={`goto-${event.extendedProps?.id as string}`}
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
