import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'
import { useRef, useState } from 'react'
import CalendarComponent from '../components/calendar/calendarComponent'
import { Url, useFetchFolderUrlQuery, useFetchVisitingHistoryQuery } from '../api/graphql'
import EventList from '../components/calendar/EventList'

export default function Calendar() {
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>()
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])
  const calendarRef = useRef<FullCalendar>(null)
  const { data: { fetchFolderUrl = null } = {} } = useFetchFolderUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: (fetchData) => {
      // 既に一度実行されている場合
      if (!calendarEvents?.length) {
        const INITIAL_EVENTS: EventInput[] = []
        fetchFolderUrl?.map((folder) =>
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

        // 初めて実行される場合
      } else {
        const INITIAL_EVENTS: EventInput[] = []
        fetchData.fetchFolderUrl?.map((folder) =>
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
        setCalendarEvents((previousEvents) => {
          const historyEvents = previousEvents?.filter((event) => event.extendedProps)
          if (historyEvents) {
            return [...INITIAL_EVENTS, ...historyEvents]
          }
          return [...INITIAL_EVENTS]
        })
      }
    },
  })
  const { data: { fetchVisitingHistory = null } = {} } = useFetchVisitingHistoryQuery({
    fetchPolicy: 'network-only',
    skip: !fetchFolderUrl,
    onCompleted: (fetchData) => {
      const historys = fetchVisitingHistory?.map((data) => ({
        id: data.urlId,
        title: identifyNotificationEvent(data.urlId)?.title
          ? (identifyNotificationEvent(data.urlId)?.title as string)
          : 'no title',
        date: data.date,
        backgroundColor: 'red',
        borderColor: 'red',
        editable: false,
        extendedProps: { id: data.id },
      }))
      const historyEvents = calendarEvents?.filter((event) => event.extendedProps)

      // 既に一度実行されている場合
      if (historyEvents?.length) {
        setCalendarEvents((events) => {
          const notificatinEvents = events?.filter((event) => !event.extendedProps)
          const newHistorys = fetchData.fetchVisitingHistory?.map((data) => ({
            id: data.urlId,
            title: identifyNotificationEvent(data.urlId)?.title
              ? (identifyNotificationEvent(data.urlId)?.title as string)
              : 'no title',
            date: data.date,
            backgroundColor: 'red',
            borderColor: 'red',
            editable: false,
            extendedProps: { id: data.id },
          }))
          if (notificatinEvents && newHistorys) {
            return [...notificatinEvents, ...newHistorys]
          }
          if (newHistorys) {
            return [...newHistorys]
          }
          if (!newHistorys && notificatinEvents) {
            return [...notificatinEvents]
          }
          return undefined
        })

        // 初めて実行される場合
      } else if (calendarEvents && historys) {
        setCalendarEvents([...calendarEvents, ...historys])
      } else if (!calendarEvents && historys) {
        setCalendarEvents(historys)
      }
    },
  })
  const identifyNotificationEvent = (eventId: string): Url | undefined =>
    fetchFolderUrl?.map((folder) => folder.urls.find((url) => url.id === eventId)).find((url) => url !== undefined)
  return (
    <>
      <CalendarComponent props={{ calendarEvents, identifyNotificationEvent, setCurrentEvents, calendarRef }} />
      <EventList props={{ calendarEvents, currentEvents, identifyNotificationEvent, calendarRef }} />
    </>
  )
}
