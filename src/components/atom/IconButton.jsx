import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";

export default function IButton(props) {
  return props.url !== "" ? (
    <a target="_blank" rel="noopener noreferrer" href={props.url}>
      <IconButton color="primary" aria-label="upload picture" component="span">
        <Visibility />
      </IconButton>
    </a>
  ) : (
    <div></div>
  );
}
