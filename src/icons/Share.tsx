import React from 'react';

const Share: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 2V24H14V2H18Z" />
    <path d="M14.7721 0.421296C15.4943 -0.140432 16.5057 -0.140432 17.2279 0.421296L26.2279 7.4213L23.7721 10.5787L16 4.53372L8.22788 10.5787L5.77212 7.4213L14.7721 0.421296Z" />
    <path d="M2 30V16H6V28H26V16H30V30C30 31.1046 29.1046 32 28 32H4C2.89543 32 2 31.1046 2 30Z" />
  </svg>
);

export default Share;
