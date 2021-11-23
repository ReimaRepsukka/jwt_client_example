import {useState} from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

let loginUrl = "http://localhost/jwt_server/login.php";


/**
 * Login-sivu
 */
function Login(){

    //Formin tietojen hallinta
    const [username, setUsername] = useState("");
    const [pw, setPw] = useState("");

    //Jos session token on asetettu, ohjataan pääsivulle
    if(sessionStorage.getItem("token")){
        return <Navigate to='/' />
    }

    //Jso ei session tokenia, näytetään login form
    return (
        <div>
          <form onSubmit={ e => loginUser(e,username,pw, setPw)}>
            <label>Username:</label>
            <input type='text' value={username} onChange={e=>setUsername(e.target.value)}></input>
            <label>Password:</label>
            <input type='password' value={pw} onChange={e=>setPw(e.target.value)}></input>
            <input type='submit' value="Login"></input>
          </form>
        </div>
      );
}

//Funktio login-toiminnon hallintaan
function loginUser(e, username, pw, setPw ){
    e.preventDefault();

    //Basic auth header login tiedoista (windos.btoa, koska pelkkä btoa yrittää käyttää Reactin omaan deprekoitunutta)
    let params = {
      headers: { 'Authorization':'Basic ' +  window.btoa( username+":"+pw ) },
      withCredentials: true
    }

    //Lähetetään tiedot palvelimelle. Jos vastaus OK, talletetaan token.
    //Samalla tyhjennetään password-kenttä, mikä aiheuttaa sivun renderöinnin uudelleen.
    axios.post(loginUrl, null, params)
      .then(resp => {
        if(resp.status === 200){
          sessionStorage.setItem("token", resp.data.token);
          setPw("");
        }
      })
      .catch(e => console.log(e))
}

export default Login;
