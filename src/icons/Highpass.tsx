import React from 'react';

const Highpass: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    fill="currentColor"
    width="1em"
    height="1em"
    viewBox="0 0 64 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M57 4V0H33c-6.456 0-11.412 2.031-15.155 5.15-3.709 3.091-6.123 7.16-7.702 11.107-1.58 3.951-2.362 7.874-2.75 10.79a47.661 47.661 0 00-.343 3.549 33.572 33.572 0 00-.05 1.29V31.998s0 .002 2 .002L11 32v-.061l.005-.224c.005-.2.016-.503.039-.891.044-.778.133-1.899.313-3.248.362-2.71 1.08-6.286 2.5-9.834 1.421-3.553 3.507-6.984 6.548-9.518C23.411 5.719 27.455 4 33 4h24z" />{' '}
  </svg>
);

export default Highpass;
