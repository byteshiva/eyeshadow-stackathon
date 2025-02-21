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
    "natural",
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
    window.gapi.load("client", loadClient);
  });

  return (
    <div className="App">
      <h1>Select the colors you'd like to see the tutorials of:</h1>
      <div id="colors">
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
      </div>

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

      {searchResults.slice(0, 10).map((sr) => (
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
