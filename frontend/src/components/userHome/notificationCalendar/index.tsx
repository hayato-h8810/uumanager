import FullCalendar, { EventInput } from '@fullcalendar/react'
import { useRef, useState } from 'react'
import styled from 'styled-components'
import Calendar from './calendar'
import { Url, useFetchFolderAndUrlQuery } from '../../../api/graphql'
import EventList from './eventList'

export default function Index() {
  const [calendarEvents, setCalendarEvents] = useState<EventInput[]>()
  const [selectedId, setSelectedId] = useState<string | null>()
  const [eventClick, setEventClick] = useState(true)
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
              title: url.title,
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
    <Container>
      <Calendar props={{ calendarEvents, identifyUrl, calendarRef, selectedId, setSelectedId, setEventClick }} />
      <EventList props={{ calendarEvents, calendarRef, selectedId, setSelectedId, eventClick, setEventClick }} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 604px;
  grid-template-columns: 600px 840px;
  grid-template-areas: 'eventList calendar';
`
