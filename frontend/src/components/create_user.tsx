import { useState } from "react";
import { useCreateUserMutation } from "../api/graphql";

export default function CreateUser(){
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [createuser] = useCreateUserMutation();
  return(
    <>
    <h1>create_user</h1>
    <label htmlFor="name">
      name:
      <input onChange={(e) => setName(e.target.value)} value={name}/>
    </label>
    <label htmlFor="email">
      email:
      <input onChange={(e) => setEmail(e.target.value)} value={email}/>
    </label>
    <label htmlFor="password">
      password:
      <input onChange={(e) => setPassword(e.target.value)} value={password}/>
    </label>
    <input onClick={() => {
      void createuser({ variables: { name, credentials: {password, email}}});
      setName("");
      setEmail("");
      setPassword("");
    }}
    type="submit" value="新規作成"
    />
    </>
  )
}
