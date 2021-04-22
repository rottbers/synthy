import React from 'react';

const Arrow: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23.2748 16L3.92627 3.68733L6.07377 0.312683L28.0738 14.3127C28.6507 14.6798 29 15.3162 29 16C29 16.6838 28.6507 17.3202 28.0738 17.6873L6.07377 31.6873L3.92627 28.3127L23.2748 16Z" />
  </svg>
);

export default Arrow;
