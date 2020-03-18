import React, { useEffect, useState } from "react";
import { Typography, Popover, Button } from "antd";
import axios from "axios";
import "./favourite.css";
import { useSelector } from "react-redux";
import { IMAGE_BASE_URL, POSTER_SIZE } from "../../Config";

const { Title } = Typography;

function FavouritePage() {
  const user = useSelector(state => state.user);

  const [Favourites, setFavourites] = useState([]);
  const [Loading, setLoading] = useState(true);
  let variable = { userFrom: localStorage.getItem("userId") };

  useEffect(() => {
    fetchFavouredMovie();
  }, []);

  const fetchFavouredMovie = () => {
    axios.post("/api/favourite/getFavouredMovie", variable).then(response => {
      if (response.data.success) {
        console.log(response.data.favourites);
        setFavourites(response.data.favourites);
        setLoading(false);
      } else {
        alert("Failed to get subscription videos");
      }
    });
  };

  const onClickDelete = (movieId, userFrom) => {
    const variables = {
      movieId: movieId,
      userFrom: userFrom
    };

    axios
      .post("/api/favorite/removeFromFavourite", variables)
      .then(response => {
        if (response.data.success) {
          fetchFavouredMovie();
        } else {
          alert("Failed to Remove From Favorite");
        }
      });
  };

  const renderCards = Favourites.map((favourite, index) => {
    const content = (
      <div>
        {favourite.moviePost ? (
          <img src={`${IMAGE_BASE_URL}${POSTER_SIZE}${favourite.moviePost}`} />
        ) : (
          "no image"
        )}
      </div>
    );

    return (
      <tr key={index}>
        <Popover content={content} title={`${favourite.movieTitle}`}>
          <td>{favourite.movieTitle}</td>
        </Popover>

        <td>{favourite.movieRunTime} mins</td>
        <td>
          <button
            onClick={() => onClickDelete(favourite.movieId, favourite.userFrom)}
          >
            {" "}
            Remove{" "}
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Favourite Movies By Me </Title>
      <hr />
      {user.userData && !user.userData.isAuth ? (
        <div
          style={{
            width: "100%",
            fontSize: "2rem",
            height: "500px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <p>Please Log in first...</p>
          <a href="/login">Go to Login page</a>
        </div>
      ) : (
        !Loading && (
          <table>
            <thead>
              <tr>
                <th>Movie Title</th>
                <th>Movie RunTime</th>
                <td>Remove from favourites</td>
              </tr>
            </thead>
            <tbody>{renderCards}</tbody>
          </table>
        )
      )}
    </div>
  );
}

export default FavouritePage;
