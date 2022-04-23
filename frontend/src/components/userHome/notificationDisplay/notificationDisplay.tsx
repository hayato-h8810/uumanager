import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'
import { useRef, useState } from 'react'
import Calendar from './calendar'
import { Url, useFetchFolderAndUrlQuery } from '../../../api/graphql'
import List from './list'

export default function NotificationDisplay() {
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>()
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])
  const calendarRef = useRef<FullCalendar>(null)
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: (fetchData) => {
      const INITIAL_EVENTS: EventInput[] = []
      fetchData.fetchFolderAndUrl?.map((folder) =>
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
      setCalendarEvents(INITIAL_EVENTS)
    },
  })

  const identifyUrl = (eventId: string): Url | undefined =>
    fetchFolderAndUrl?.map((folder) => folder.urls.find((url) => url.id === eventId)).find((url) => url !== undefined)
  return (
    <>
      <Calendar props={{ calendarEvents, identifyUrl, setCurrentEvents, calendarRef }} />
      <List props={{ calendarEvents, currentEvents, identifyUrl, calendarRef }} />
    </>
  )
}