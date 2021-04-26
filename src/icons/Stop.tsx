import React from 'react';

const Stop: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 2a2 2 0 012-2h28a2 2 0 012 2v28a2 2 0 01-2 2H2a2 2 0 01-2-2V2zm4 2v24h24V4H4z" />
  </svg>
);

export default Stop;
