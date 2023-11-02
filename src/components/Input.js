import React from "react";

const Input = ({ location, onChangeLocation, onSearch }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Insert location..."
        value={location}
        onChange={onChangeLocation}
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
};

export default Input;
