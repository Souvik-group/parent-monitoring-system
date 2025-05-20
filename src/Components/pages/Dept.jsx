import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dept.css";

const Dept = () => {
  const navigate = useNavigate();
  const departments = ["BCA", "English", "Bengali", "Botany","Chemistry","Education","Geography","History","Philosophy","Sanskrit"];

  const handleClick = (dept) => {
    navigate(`/department/${dept.toLowerCase()}`);
  };

  return (
    <div className="dept-content">
    <h1>
      Department List
    </h1>
      <div className="dept-buttons">
        {departments.map((dept, index) => (
          <button key={index} onClick={() => handleClick(dept)}>
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dept;
