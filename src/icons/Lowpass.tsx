import React from 'react';

const Lowpass: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 64 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 4V0h24c6.456 0 11.411 2.031 15.155 5.151 3.709 3.09 6.123 7.159 7.702 11.106 1.58 3.952 2.362 7.875 2.75 10.791.196 1.463.294 2.686.343 3.549a33.585 33.585 0 01.05 1.291V31.998S57 32 55 32l-2 .001v-.061l-.005-.224c-.005-.2-.016-.502-.039-.891a43.654 43.654 0 00-.314-3.248c-.36-2.71-1.08-6.286-2.499-9.834-1.421-3.553-3.507-6.984-6.548-9.52C40.589 5.72 36.545 4 31 4H7z" />
  </svg>
);

export default Lowpass;
