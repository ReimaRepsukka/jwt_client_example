import {useState} from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

let resUrl = "http://localhost/jwt_server/resources.php";

/**
 * Pääsivu 
 */
function App() {

  //Käyttäjän henkkoht content
  const [content, setContent] = useState("");

  //Jos ei ole session tokenia, ohjataan login-sivulle.
  if(!sessionStorage.getItem("token")){
    return (<Navigate to='/login' />);
  }

  //Haetaan resursi
  requestWitBearer(setContent);

  //Logout-painike poistaa tokenin ja päivittää näkymän.
  const logout = () => {
    sessionStorage.removeItem("token");
    setContent("");
  }

  return(
    <div>
      <p>Personal content: {content}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}


//Funktio joka hakee palvelimelta tokenin avulla käyttäjän resurssin.
function requestWitBearer(setContent){

  //Asetetaan bearer token headeriin
  var params = {
    headers: { 'authorization':'Bearer ' + sessionStorage.getItem("token") },
    withCredentials: true,
  }

  //Haetaan resurssia bearer-tokenin kanssa
  //Asetetaan saadusta resurssista sisältö sivulle.
  axios.get(resUrl, params)
    .then(resp=>setContent(resp.data.message))
    .catch(e=> console.log(e))
}

export default App;
