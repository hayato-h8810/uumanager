import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'
import { MutableRefObject, useState, useEffect } from 'react'
import { useEditUrlMutation, Url } from '../../../api/graphql'

interface propType {
  calendarEvents: EventInput[] | undefined
  identifyUrl: (eventId: string) => Url | undefined
  currentEvents: EventApi[]
  calendarRef: MutableRefObject<FullCalendar | null>
}

export default function List({ props }: { props: propType }) {
  const { calendarEvents, identifyUrl, calendarRef } = props
  const [selectedId, setSelectedId] = useState<string | null>()
  const [sortEvent, setSortEvent] = useState<EventInput[] | undefined>()
  const [sort, setSort] = useState(true)
  const [editUrlMutation] = useEditUrlMutation({
    onCompleted: () => {
      setSelectedId(null)
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
        <div key={event.id}>
          {event.date}:{event.title}
          <button
            type="button"
            key={event.id && `delete-${event.id}`}
            onClick={() => {
              if (event.id) {
                setSelectedId(event.id)
                const selectedUrl = identifyUrl(event.id)
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
            key={event.id && `goto-${event.id}`}
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
