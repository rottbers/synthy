import React from 'react';

const Triangle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 64 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 0a2 2 0 011.518.698L44 26.927l10.481-12.229 3.038 2.604-12 14a2 2 0 01-3.038 0L20 5.073 9.518 17.302l-3.037-2.604 12-14A2 2 0 0120 0z" />
  </svg>
);

export default Triangle;
