import React, { useEffect, useState } from "react";
import { Styled } from "./style";
import axios from "axios";
import Cookies from "universal-cookie";
import { token, kToken, loginState, loginModal, pickpoint, placelist, usersArea, usersSigg } from "../../recoil/recoil";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";

import HashTagTemplate from "../HashTagTemplate/HashTagTemplate";
//<HashTagTemplate keywordDummy={tags || []} />

function PlaceCards({ title, img, addr1, onClick, contentId, tag }) {
  const placeList = useRecoilValue(placelist);
  const accessToken = useRecoilValue(token);
  const kakaoToken = useRecoilValue(kToken);
  const [tags, setTags] = useState([]);
  const [like, setLike] = useState(0); //나중에 서버로부터 받아오게 된다.
  const [likeOrNot, setLikeOrNot] = useState(false); //이것도 서버에서 받아와야함
  const [likeLoading, setLikeLoading] = useState(false);
  const isLogin = useRecoilValue(loginState);
  const setIsLoginOpen = useSetRecoilState(loginModal);
  const cookies = new Cookies();
  const [area, setArea] = useState(usersArea);
  const [sigg, setSigg] = useState(usersSigg);
  useEffect(() => {
    setLikeLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/like/${contentId}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        setLike(response.data.data.likeCount);
        setLikeOrNot(response.data.data.isLiked);
        setLikeLoading(false);
      });
    // .then((res) => {
    //   axios
    //     .get(`${process.env.REACT_APP_API_URL}/post/${contentId}`, {
    //       headers: {
    //         Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
    //         "Content-Type": "application/json",
    //       },
    //       withCredentials: true,
    //     })
    //     .then((response) => {
    //       if (response.data.post.post_tags) setTags(response.data.post.post_tags.split(","));
    //     });
    // });

    setLikeLoading(false);
  }, [placeList, likeOrNot]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/post/${contentId}`, {
        headers: {
          Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
      .then((response) => {
        // console.log(response.data.post.post_tags);
        if (response.data.post.post_tags) setTags(response.data.post.post_tags.split(","));
        else if (response.data.post.post_tags === null) setTags([]);
      });
  }, [placeList]);
  const LikeHandler = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      setIsLoginOpen(true);
      return;
    }
    setLikeLoading(true);
    if (!likeOrNot) {
      e.preventDefault();
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/like/${contentId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          const like = { likeOrNot: res.data.data.isLiked, likeCount: res.data.data.likeCount };
          setLike(like.likeCount);
          setLikeOrNot(like.likeOrNot);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setIsLoginOpen(true);
          }
        });
    } else {
      e.preventDefault();
      axios
        .delete(`${process.env.REACT_APP_API_URL}/like/${contentId}`, {
          headers: {
            Authorization: `Bearer ${cookies.get("jwt") || cookies.get("kakao-jwt")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        })
        .then((res) => {
          const like = { likeOrNot: res.data.data.isLiked, likeCount: res.data.data.likeCount };

          setLike(like.likeCount);
          setLikeOrNot(like.likeOrNot);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            setIsLoginOpen(true);
          }
        });
    }
    setLikeLoading(false);
  };

  return (
    <Styled.PlaceCard onClick={onClick}>
      <div className="place-cards">
        {!tags[0] ? (
          <Styled.Tags>&nbsp;</Styled.Tags>
        ) : (
          <Styled.Tags>
            {tags.map((el, idx) => {
              return (
                <div key={idx}>
                  <Styled.Tag>{"#" + el}</Styled.Tag>
                </div>
              );
            })}
          </Styled.Tags>
        )}
        {img ? <img src={img} /> : <img src="./images/not-image-yet.png" />}
        <div className="place-cards-title">
          <div>{`[${addr1}] `}</div>
          <span>{title}</span>
        </div>
        {likeLoading ? (
          <Styled.LikeBtn onClick={(e) => e.preventDefault()}>
            <i className={likeOrNot ? "fas fa-heart" : "hide"}>
              <span>?</span>
            </i>
          </Styled.LikeBtn>
        ) : (
          <Styled.LikeBtn onClick={(e) => LikeHandler(e)}>
            <i className={likeOrNot ? "fas fa-heart" : "hide"}>
              <span>{like}</span>
            </i>

            <i className={likeOrNot ? "hide" : "far fa-heart"}>
              <span>{like}</span>
            </i>
          </Styled.LikeBtn>
        )}
      </div>
    </Styled.PlaceCard>
  );
}
//값이 바뀌는 상황이 더 많을것이라 생각해 memo안함.
export const MemoCards = PlaceCards;
