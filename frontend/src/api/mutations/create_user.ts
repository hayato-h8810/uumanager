import { gql } from "@apollo/client";

export default gql`
  mutation createUser($credentials: AUTH_PROVIDER_CREDENTIALS!, $name: String!){
    createUser(input: {name: $name,authProvider: {credentials: $credentials}}){    
      id
      name
      email    
  }
}`;
 

