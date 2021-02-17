import axios from "axios";
import { useState } from "react";

export default ({url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState([]);
    const doRequest = async (props = {}) => {
        try {
            setErrors([]);
            const response =  await axios[method](url, 
                {...body, ...props} // merge props to body
                );    
            if(onSuccess) {
                onSuccess(reponse.data);
            }
            return response.data;
          } catch (error) {          
              setErrors(
                (<div className="alert alert-danger">
                <h4>Errors</h4>
                <ul className="my-0">
                   {error.response.data.errors.map((err) => (
                       <li key={err.message}>{err.message}</li>
                   ))}
                </ul>
            </div>)
              );              
          }
    };

    return {doRequest, errors};
};