import React from "react";
import ResumeSearchRefactored from "./ResumeSearch/ResumeSearchRefactored";
import { ResumeSearchProps } from "./ResumeSearch/types";

const ResumeSearch: React.FC<ResumeSearchProps> = (props) => {
  return <ResumeSearchRefactored {...props} />;
};

export default ResumeSearch;
