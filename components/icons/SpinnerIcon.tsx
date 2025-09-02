
import React from 'react';

export const SpinnerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
        <style>
        {`
            .spinner_V8m1 {
                transform-origin: center;
                animation: spinner_zKoa 2s linear infinite;
            }
            .spinner_YpZS {
                stroke-dasharray: 125;
                stroke-dashoffset: 125;
                animation: spinner_piVe 1.8s ease-in-out infinite;
            }
            @keyframes spinner_zKoa {
                100% {
                    transform: rotate(360deg);
                }
            }
            @keyframes spinner_piVe {
                0% {
                    stroke-dashoffset: 125;
                }
                50% {
                    stroke-dashoffset: 0;
                }
                100% {
                    stroke-dashoffset: -125;
                }
            }
        `}
        </style>
        <g className="spinner_V8m1">
            <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" stroke="currentColor" strokeOpacity="0.2"></circle>
            <circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" stroke="currentColor" className="spinner_YpZS"></circle>
        </g>
    </svg>
);
