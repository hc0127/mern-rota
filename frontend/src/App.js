import "./css/App.css";
import "./css/sidebar.css";

import React from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import { createBrowserHistory } from "history";

import Layout from "./layout";

function getToken(){
  console.log("gettoken");
  const tokenString = sessionStorage.getItem('data');
  console.log("tokenString",tokenString);
  const user = JSON.parse(tokenString);
  console.log("user",user);
  if(user){
    if(user.token == 'undefined'){
      return false;
    }else{
      return user.token;
    }
  }else{
    return false;
  }
}

function App() {
  const token = getToken();
  const history = createBrowserHistory();

  console.log(token);
  if (!token) {
    console.log("pass",token);
    history.push("login");
    return <Login />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <Routes history={history}>
          {token && <Route path="/login" element={<Login />} />}
          <Route path="*" element={<Layout />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
