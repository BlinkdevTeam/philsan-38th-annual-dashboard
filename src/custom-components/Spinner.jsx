import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-t-transparent"></div>
    </div>
  );
};

export default Spinner;