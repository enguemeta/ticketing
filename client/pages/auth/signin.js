import { useState } from "react";
import Router from "next/router";

import useRequest from "../../hooks/use-requests";


export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
      url: "/api/users/signin",
      method: "post",
      body: {
          email, password
      },
      onSuccess: () => Router.push("/")
  });

  const onSubmit = async (event) => {
      event.preventDefault();          
        await doRequest();              
  }

return (
    <div className="container">
    <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group">            
            <label>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control"></input>            
        </div>
        <div className="form-group">            
            <label>password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-control"></input>            
        </div>
       { errors }
        <button type="submit" className="btn btn-primary">Sign In</button>
        
    </form>
    </div>
);
};