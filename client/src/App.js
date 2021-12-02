import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./App.css";

import { useRecoilState } from "recoil";

import { loginState } from "./recoil/recoil";
import { userInformation } from "./recoil/recoil";

import Mainpage from "./pages/Mainpage";
import Home from "./pages/Home";
import DetailPage from "./pages/DetailPage/DetailPage-index";
import Header from "./components/Header";

const App = () => {
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const [userInfo, setUserinfo] = useRecoilState(userInformation);

  const history = useHistory();

  const isAuthenticated = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/user/info`).then((res) => {
      setUserinfo(res.data.data.userInfo);
      setIsLogin(true);
      history.push("/");
    });
  };

  const handleResponseSuccess = () => {
    isAuthenticated();
  };
  return (
    <>
      <BrowserRouter>
        <Header handleResponseSuccess={handleResponseSuccess} />
        <Switch>
          <Route exact path="/">
            <Mainpage />
          </Route>
          <Route exact path="/home">
            <Home userinfo={userInfo} />
          </Route>
          {/* <Redirect from="*" to="/" /> */}
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
