import React, { useState } from "react";
import { useRecoilState } from "recoil";
import ModalLogin from "../ModalLogin";
import ModalSignup from "../ModalSignup";
import { withCookies, Cookies, useCookies } from "react-cookie";
import { Styled } from "./style";
import { isSavepositionOpen, loginState, loginModal } from "../../recoil/recoil";
import ModalSavePosition from "../ModalSavePosition/ModalSavePosition-index";
import axios from "axios";
import { Link } from "react-router-dom";

//링크에 밑줄떠서 추가했어요

const Header = ({ handleResponseSuccess }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const [isLoginOpen, setIsLoginOpen] = useRecoilState(loginModal);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isSavePositionOpen, setIsSavePositionOpen] = useRecoilState(isSavepositionOpen);
  const [isLogin, setIsLogin] = useRecoilState(loginState);
  const openLoginModalHandler = (e) => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
    } else if (!isLoginOpen) {
      setIsLoginOpen(true);
    }
  };

  const closeLoginModalHandler = (e) => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
    }
  };

  const openSignupModalHandler = (e) => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
    } else if (!isSignupOpen) {
      setIsSignupOpen(true);
    }
  };

  const closeSignupModalHandler = (e) => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
    }
  };

  const closeSavePositionModalHandler = (e) => {
    setIsSavePositionOpen(false);
  };

  const ToLoginModal = () => {
    if (isSignupOpen) {
      setIsSignupOpen(false);
      setIsLoginOpen(true);
    }
  };

  const ToSignupModal = () => {
    if (isLoginOpen) {
      setIsLoginOpen(false);
      setIsSignupOpen(true);
    }
  };
  const logoutHandler = () => {
    console.log("hi");
    axios.post("http://localhost:80/signout", {}, { withCredentials: true }).then((res) => {
      //로긴상태 해제
      setIsLogin(false);
    });
    console.log(isLogin);
    // console.log(cookies);
  };

  return (
    <>
      <Styled.ModalContainer>
        {isLoginOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeLoginModalHandler}>
              <Styled.ModalView onClick={(e) => e.stopPropagation()}>
                <ModalLogin
                  handleResponseSuccess={handleResponseSuccess}
                  ToSignupModal={ToSignupModal}
                  closeLoginModalHandler={closeLoginModalHandler}
                />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>
      <Styled.ModalContainer>
        {isSignupOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeSignupModalHandler}>
              <Styled.ModalView onClick={(e) => e.stopPropagation()}>
                <ModalSignup handleResponseSuccess={handleResponseSuccess} ToLoginModal={ToLoginModal} />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>

      <Styled.ModalContainer>
        {isSavePositionOpen ? (
          <>
            <Styled.ModalBackdrop onClick={closeSavePositionModalHandler}>
              <Styled.ModalView onClick={(e) => e.stopPropagation()}>
                <ModalSavePosition />
              </Styled.ModalView>
            </Styled.ModalBackdrop>
          </>
        ) : null}
      </Styled.ModalContainer>

      {/* 지금 홈화면 인지 아닌지 상태로 */}
      <Styled.HeaderContainer>
        <div className="header-wrapper">
          <Link to="/">
            {/* 링크하면 자꾸 밑줄생겨서 이래저래 해보다 그냥 이미지로 바꿨습니다.. */}
            {/* <div id="logo">아는동네</div> */}
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" id="logo"></img>
          </Link>
          <div className="header-button-wrapper">
            {!isLogin ? (
              <>
                <div className="mainpage-button" onClick={openLoginModalHandler}>
                  login
                </div>
                <div className="mainpage-button" onClick={openSignupModalHandler}>
                  Sign Up
                </div>
              </>
            ) : (
              <>
                <div className="mainpage-button" onClick={logoutHandler}>
                  Log Out
                </div>
                <div className="mainpage-button" onClick={openSignupModalHandler}>
                  My Page
                </div>
              </>
            )}
          </div>
        </div>
      </Styled.HeaderContainer>
    </>
  );
};

export default Header;
