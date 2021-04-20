import React from 'react';

const Square: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 64 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 2a2 2 0 012-2h24a2 2 0 012 2v26h20V16h4v14a2 2 0 01-2 2H32a2 2 0 01-2-2V4H10v12H6V2z" />
  </svg>
);

export default Square;
