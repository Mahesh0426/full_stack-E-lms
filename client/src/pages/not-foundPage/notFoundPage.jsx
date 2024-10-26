import { div } from "framer-motion/client";
import React from "react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="text-center mt-12">
      <h1> 404- Page Not Found</h1>
      <p>Oops! The Page you're looking for dose not exists.</p>
      <Link to="/"> Go back to Home</Link>
    </div>
  );
};

export default PageNotFound;
