import React from 'react';

const Plus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M32 18H0v-4h32v4z" />
    <path d="M14 32V0h4v32h-4z" />
  </svg>
);

export default Plus;
