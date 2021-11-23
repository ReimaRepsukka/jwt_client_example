import {useState, useEffect} from 'react';
import axios from 'axios';

let loginUrl = "http://localhost/jwt_server/login.php";
let resUrl = "http://localhost/jwt_server/resources.php";


//Funktio login-toiminnon hallintaan
function loginUser(e, username, pw, setAuth, setUsername, setPw ){
    e.preventDefault();

    //Basic auth header login tiedoista (windos.btoa, koska pelkkä btoa yrittää käyttää Reactin omaan deprekoitunutta)
    let params = {
      headers: { 'Authorization':'Basic ' +  window.btoa( username+":"+pw ) },
      withCredentials: true
    }

    //Lähetetään tiedot palvelimelle. Jos vastaus OK,
    //talletetaan vastauksen token, nollataan kentät ja asetetaan käyttäjä loggautuneeksi
    axios.post(loginUrl, null, params)
      .then(resp => {
        if(resp.status === 200){
          sessionStorage.setItem("token", resp.data.token);
          setAuth(true);
          setUsername("");
          setPw("");
        }
      })
      .catch(e => console.log(e))
}


/**
 * Pääsivu 
 */
function App() {

  //Formin tietojen hallinta
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  //Pidetään yllä tieto, onko käyttäjä loggautunut sisään
  const [auth, setAuth ] = useState(false);

  //Asetetaan loggautuneeksi, jos sessionStoragessa on talletettu token
  if(!auth && sessionStorage.getItem("token")){
    setAuth(true);
  }

  //Jos käyttäjä ei ole kirjautunut, näytetään login-lomake. Muuten näytetään käyttäjän oma resurssi.
  if(!auth){
    return (
      <div>
        <form onSubmit={ e => loginUser(e,username,pw,setAuth,setUsername,setPw)}>
          <label>Username:</label>
          <input type='text' value={username} onChange={e=>setUsername(e.target.value)}></input>
          <label>Password:</label>
          <input type='password' value={pw} onChange={e=>setPw(e.target.value)}></input>
          <input type='submit' value="Login"></input>
        </form>
      </div>
    );
  }else{
    //Näytetään loggautuneen käyttäjän resurssi.
    //Välitetään myös setAuth, jotta sivulta voidaan loggautua ulos.
    return <Resource auth={setAuth} />;  
  }
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


/**
 * Käyttäjän resurssisivu
 */
function Resource(props){

  //Käyttäjän henkkoht content
  const [content, setContent] = useState("");

  //useEffect, jota Kutsutaan yhden kerran komponentille.
  useEffect(() => requestWitBearer(setContent), []);

  //Logout-painike poistaa tokenin ja asettaa auth useStaten falseksi
  //Tämä aiheuttaa App-sivun lataamisen uudelleen, jolloin login-lomake tulee näkyviin.
  const logout = () => {
    sessionStorage.removeItem("token");
    props.auth(false);
  }

  return(
    <div>
      <p>Personal content: {content}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
