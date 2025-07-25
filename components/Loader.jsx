"use client";
import React from "react";

export default function Loader() {
  return (
    <div className="d-flex justify-content-center align-items-center" >
      <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
