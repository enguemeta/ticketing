import axios from "axios";

const buildClient =  ({ req }) => {
    if(typeof window === "undefined") {
        // we are on the server
        try {
          return axios.create({
               baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",               
               headers: req.headers             
          });
        } catch (e) {
           console.error(e);
        }
       
     } else{
       // We are on the browser
       return axios.create({
        baseURL: "/"        
   });
     }  
};

export default buildClient;