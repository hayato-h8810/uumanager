import { useState } from 'react'
import styled from 'styled-components'
import { Url } from '../../../api/graphql'
import FolderList from './folderList'
import UrlList from './urlList'

export default function Index() {
  const [selectUrlArray, setSelectUrlArray] = useState<Url[] | null>()

  return (
    <Container>
      <FolderList props={{ selectUrlArray, setSelectUrlArray }} />
      <UrlList props={{ selectUrlArray }} />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 659px;
  grid-template-columns: 450px 990px;
  grid-template-areas: 'folderList urlList';
`
