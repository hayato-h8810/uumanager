import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { useFetchFolderAndUrlQuery } from '../../../api/graphql'
import Navigation from './navigation'
import UrlDescription from './urlDescription'
import BrowsingHistories from './browsingHistories'
import PageNotFound from '../../../views/pageNotFound'

interface RouterParams {
  id: string
}

export default function Index() {
  const { id } = useParams<RouterParams>()
  const [isFoundUrl, setIsFoundUrl] = useState(true)
  const { data: { fetchFolderAndUrl = null } = {} } = useFetchFolderAndUrlQuery({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      let specificUrl
      fetchFolderAndUrl?.forEach((folder) =>
        folder.urls.forEach((url) => {
          if (url.id === id) specificUrl = url
        })
      )
      if (!specificUrl) setIsFoundUrl(false)
    },
  })

  if (!isFoundUrl) return <PageNotFound />

  return (
    <Container>
      <Navigation />
      <UrlDescription />
      <BrowsingHistories />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: 250px 820px 370px;
  grid-template-areas: 'navigation urlDescription browsingHistory';
`
