import FullCalendar, { EventInput } from '@fullcalendar/react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import Calendar from './calendar'
import { Url, useFetchFolderAndUrlQuery, useFetchBrowsingHistoryQuery } from '../../../api/graphql'
import EventList from './eventList'

export default function Index() {
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>()
  const [selectedId, setSelectedId] = useState<string | null>()
  const [eventClick, setEventClick] = useState(true)
  const calendarRef = useRef<FullCalendar>(null)
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
  })
  const { data: { fetchBrowsingHistory = null } = {} } = useFetchBrowsingHistoryQuery({
    fetchPolicy: 'network-only',
    skip: !fetchFolderAndUrl,
    onCompleted: () => {
      const historys = fetchBrowsingHistory?.map((data) => ({
        id: data.urlId,
        title: identifyUrl(data.urlId)?.title,
        date: data.date,
        backgroundColor: 'red',
        borderColor: 'red',
        editable: false,
        extendedProps: { id: data.id },
      }))
      setCalendarEvents(historys)
    },
  })

  const identifyUrl = (eventId: string): Url | undefined =>
    fetchFolderAndUrl?.map((folder) => folder.urls.find((url) => url.id === eventId)).find((url) => url !== undefined)
  return (
    <Container>
      <Calendar props={{ calendarEvents, identifyUrl, calendarRef, setSelectedId, eventClick, setEventClick }} />
      <EventList props={{ calendarEvents, calendarRef, selectedId, setSelectedId, eventClick }} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 604px;
  grid-template-columns: 600px 840px;
  grid-template-areas: 'eventList calendar';
`
