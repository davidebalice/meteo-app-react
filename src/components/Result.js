import React, { useState, useEffect } from "react";
import Day from "./Day";

const Result = ({ location, weather }) => {
  const {
    temperature_2m_max: max,
    temperature_2m_min: min,
    time: dates,
    weathercode: codes,
  } = weather;

  return (
    <div>
      <h2>{location}</h2>
      <ul className="weather">
        {dates &&
          dates.map((date, i) => (
            <>
              <Day
                date={date}
                max={max.at(i)}
                min={min.at(i)}
                code={codes.at(i)}
                key={date}
                isToday={i === 0}
              />
            </>
          ))}
      </ul>
    </div>
  );
};

export default Result;
