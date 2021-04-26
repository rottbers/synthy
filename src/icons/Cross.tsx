import React from 'react';

const Cross: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M27.586 30.414l-26-26 2.828-2.828 26 26-2.828 2.828z" />
    <path d="M1.586 27.586l26-26 2.828 2.828-26 26-2.828-2.828z" />
  </svg>
);

export default Cross;
