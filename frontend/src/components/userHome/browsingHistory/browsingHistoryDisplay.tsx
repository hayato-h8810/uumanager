import FullCalendar, { EventApi, EventInput } from '@fullcalendar/react'
import { useRef, useState } from 'react'
import Calendar from './calendar'
import { Url, useFetchFolderAndUrlQuery, useFetchBrowsingHistoryQuery } from '../../../api/graphql'
import List from './list'

export default function BrowsingHistoryDisplay() {
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>()
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])
  const calendarRef = useRef<FullCalendar>(null)
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
  })
  const { data: { fetchBrowsingHistory = null } = {} } = useFetchBrowsingHistoryQuery({
    fetchPolicy: 'network-only',
    skip: !fetchFolderAndUrl,
    onCompleted: () => {
      console.log(fetchBrowsingHistory)
      const historys = fetchBrowsingHistory?.map((data) => {
        console.log(identifyUrl(data.urlId)?.title)
        return {
          id: data.urlId,
          title: identifyUrl(data.urlId)?.title ? (identifyUrl(data.urlId)?.title as string) : 'no title',
          date: data.date,
          backgroundColor: 'red',
          borderColor: 'red',
          editable: false,
          extendedProps: { id: data.id },
        }
      })
      setCalendarEvents(historys)
    },
  })

  const identifyUrl = (eventId: string): Url | undefined =>
    fetchFolderAndUrl?.map((folder) => folder.urls.find((url) => url.id === eventId)).find((url) => url !== undefined)
  return (
    <>
      <Calendar props={{ calendarEvents, identifyUrl, setCurrentEvents, calendarRef }} />
      <List props={{ calendarEvents, currentEvents, calendarRef }} />
    </>
  )
}
