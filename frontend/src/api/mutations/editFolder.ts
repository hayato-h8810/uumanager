import { gql } from '@apollo/client'

export default gql`
  mutation editFolder($folderId: String!, $folderName: String!) {
    editFolder(input: { folderId: $folderId, folderName: $folderName }) {
      id
      name
      urls {
        id
        title
        memo
        notification
        url
        importance
        folderId
        createdAt
      }
    }
  }
`
