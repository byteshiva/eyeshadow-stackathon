import logo from "./logo.svg";
import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const colorNames = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "black",
    "white",
    "brown",
    "purple",
    "pink",
    "gold",
    "silver",
    "rainbow",
    "festival",
    "glitter",
  ];

  const [colorState, setColorState] = useState(
    colorNames.reduce((acc, color) => {
      acc[color] = false;
      return acc;
    }, {})
  );

  function authenticate() {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
      .then(
        function () {
          console.log("Sign-in successful");
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  }
  function loadClient() {
    window.gapi.client.setApiKey("AIzaSyCui-26y5yv0sx6NXqFt8jBnPKhcI2_xrg");
    return window.gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function () {
          console.log("GAPI client loaded for API");
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  useEffect(() => {
    window.gapi.load("client:auth2", function () {
      window.gapi.auth2.init({
        client_id:
          "237502912677-r9b0i15f3b2fgn4tuodv5i2lncflsc8a.apps.googleusercontent.com",
      });
    });
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          The first <code>step</code>.
        </p>

        <button
          onClick={() => {
            authenticate().then(loadClient);
          }}
        >
          Authenticate
        </button>
        <button
          onClick={() => {
            const checkedColors = colorNames
              .filter((color) => colorState[color])
              .map((color) => `"${color}"`);
            window.gapi.client.youtube.search
              .list({
                part: ["snippet"],
                maxResults: 25,
                q: `${
                  checkedColors.length ? checkedColors.join(" ") : "natural"
                } eyeshadow`,
              })
              .then(
                function (response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response);
                  setSearchResults(response.result.items);
                },
                function (err) {
                  console.error("Execute error", err);
                }
              );
          }}
        >
          Search
        </button>
      </header>
      {colorNames.map((color) => (
        <div key={color}>
          <label htmlFor={color}>
            {color[0].toUpperCase() + color.slice(1)}
          </label>
          <input
            name={color}
            type="checkbox"
            checked={colorState[color]}
            onChange={() =>
              setColorState({ ...colorState, [color]: !colorState[color] })
            }
          />
        </div>
      ))}

      {searchResults.slice(0, 5).map((sr) => (
        <div key={sr.id.videoId}>
          <iframe
            title={sr.id.videoId}
            width="700"
            height="345"
            src={`https://www.youtube.com/embed/${sr.id.videoId}`}
          ></iframe>
        </div>
      ))}
    </div>
  );
}

export default App;
