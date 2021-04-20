import React from 'react';

const Saw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 64 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.306.124A2 2 0 019.52.698L30 24.593V2A2 2 0 0133.519.698L54 24.593V16h4v14a2 2 0 01-3.519 1.302L34 7.406V30a2 2 0 01-3.518 1.302L10 7.406V16H6V2A2 2 0 017.306.124z" />
  </svg>
);

export default Saw;
