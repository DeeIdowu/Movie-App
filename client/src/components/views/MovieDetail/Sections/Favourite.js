import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "antd";
import { useSelector } from "react-redux";

function Favourite(props) {
  const user = useSelector(state => state.user);

  const movieId = props.movieId;
  const userFrom = props.userFrom;
  const movieTitle = props.movieInfo.title;
  const moviePost = props.movieInfo.backdrop_path;
  const movieRunTime = props.movieInfo.runtime;

  const [FavouriteNumber, setFavouriteNumber] = useState(0);
  const [Favourited, setFavourited] = useState(false);
  const variables = {
    movieId: movieId,
    userFrom: userFrom,
    movieTitle: movieTitle,
    moviePost: moviePost,
    movieRunTime: movieRunTime
  };

  const onClickFavourite = () => {
    if (user.userData && !user.userData.isAuth) {
      return alert("Please Log in first");
    }

    if (Favourited) {
      //when we are already subscribed
      axios
        .post("/api/favourite/removeFromFavourite", variables)
        .then(response => {
          if (response.data.success) {
            setFavouriteNumber(FavouriteNumber - 1);
            setFavourited(!Favourited);
          } else {
            alert("Failed to Remove From Favourite");
          }
        });
    } else {
      // when we are not subscribed yet

      axios.post("/api/favourite/addToFavourite", variables).then(response => {
        if (response.data.success) {
          setFavouriteNumber(FavouriteNumber + 1);
          setFavourited(!Favourited);
        } else {
          alert("Failed to Add To Favourite");
        }
      });
    }
  };

  useEffect(() => {
    axios.post("/api/favourite/favouriteNumber", variables).then(response => {
      if (response.data.success) {
        setFavouriteNumber(response.data.subscribeNumber);
      } else {
        alert("Failed to get Favourite Number");
      }
    });

    axios.post("/api/favorite/favorited", variables).then(response => {
      if (response.data.success) {
        setFavourited(response.data.subcribed);
      } else {
        alert("Failed to get Favourite Information");
      }
    });
  }, []);

  return (
    <>
      <Button onClick={onClickFavourite}>
        {" "}
        {!Favourited ? "Add to Favourite" : "Not Favourite"} {FavouriteNumber}
      </Button>
    </>
  );
}

export default Favourite;
