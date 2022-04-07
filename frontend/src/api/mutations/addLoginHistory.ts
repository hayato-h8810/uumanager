import { gql } from '@apollo/client'

export default gql`
  mutation addLoginHistory($date: String!) {
    addLoginHistory(input: { date: $date }) {
      id
      date
    }
  }
`
