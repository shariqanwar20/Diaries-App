import React from "react";
import { Diaries } from "../Diaries";
import { Editor } from "../Editor";

export const Home = () => {
  return (
    <div className="two-cols">
      <div className="left">
        <Diaries />
      </div>
      <div className="right">
        <Editor />
      </div>
    </div>
  );
};
