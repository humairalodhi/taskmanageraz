import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ total, completed }) => {
  const percent =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  return (
    <div className="progressSection">
      <div className="progressInfo">
        <span>
          {completed} / {total} Completed
        </span>

        <span>{percent}%</span>
      </div>

      <div className="progress">
        <div
          className="fill"
          style={{
            width: `${percent}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;