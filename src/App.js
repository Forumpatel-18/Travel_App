import { CssBaseline, Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";

import { getPlacesData } from "./api";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import PlaceDetails from "./components/PlaceDetails/PlaceDetails";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  // const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [bounds, setBounds] = useState({ sw: 0, ne: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState("restaurants");
  const [autocomplete, setAutocomplete] = useState(null);
  // const [rating, setRating] = useState("");
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  // useEffect(() => {
  //   const filteredPlaces = places.filter(
  //     (place) => Number(place.rating) > rating
  //   );

  //   setFilteredPlaces(filteredPlaces);
  // }, [rating]);

  useEffect(() => {
    if (bounds.sw && bounds.ne) {
      setIsLoading(true);
      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
        setIsLoading(false);
      });
    }
  }, [type, bounds]);

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoordinates({ lat, lng });
  };

  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            // rating={rating}
            // setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={places}
            setChildClicked={setChildClicked}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
