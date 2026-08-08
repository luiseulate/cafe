interface Props {
  playing: boolean
}

export function AudioAnimation({ playing }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="8" y2="16">
        {playing && (
          <animate
            attributeName="y1"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="8;10;11;9;10;8"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
        {playing && (
          <animate
            attributeName="y2"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="16;14;13;15;14;16"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </line>
      <line x1="8" x2="8" y1="5" y2="19">
        {playing && (
          <animate
            attributeName="y1"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="5;7;6;7;4;5"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
        {playing && (
          <animate
            attributeName="y2"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="19;17;18;17;20;19"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </line>
      <line x1="12" x2="12" y1="9" y2="15">
        {playing && (
          <animate
            attributeName="y1"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="9;7;8;6;8;9"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
        {playing && (
          <animate
            attributeName="y2"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="15;17;16;18;16;15"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </line>
      <line x1="16" x2="16" y1="8" y2="16">
        {playing && (
          <animate
            attributeName="y1"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="8;10;9;11;9;8"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
        {playing && (
          <animate
            attributeName="y2"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="16;14;15;13;15;16"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </line>
      <line x1="20" x2="20" y1="10" y2="14">
        {playing && (
          <animate
            attributeName="y1"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="10;8;9;7;9;10"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
        {playing && (
          <animate
            attributeName="y2"
            calcMode="spline"
            dur="1s"
            repeatCount="indefinite"
            values="14;16;15;17;15;14"
            keyTimes="0;0.2;0.4;0.6;0.8;1"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </line>
    </svg>
  )
}

export function BookAnimation({ playing }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 7v14" />
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      <path d="M6 8h2">
        {playing && (
          <animate
            attributeName="stroke-opacity"
            values="1;0.15;1"
            keyTimes="0;0.5;1"
            dur="2.4s"
            begin="0s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
      <path d="M6 12h2">
        {playing && (
          <animate
            attributeName="stroke-opacity"
            values="1;0.15;1"
            keyTimes="0;0.5;1"
            dur="2.4s"
            begin="0.6s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
      <path d="M16 8h2">
        {playing && (
          <animate
            attributeName="stroke-opacity"
            values="1;0.15;1"
            keyTimes="0;0.5;1"
            dur="2.4s"
            begin="1.2s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
      <path d="M16 12h2">
        {playing && (
          <animate
            attributeName="stroke-opacity"
            values="1;0.15;1"
            keyTimes="0;0.5;1"
            dur="2.4s"
            begin="1.8s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
        )}
      </path>
    </svg>
  )
}

export function GamepadAnimation({ playing }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g>
        {playing && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 12 12; -12 12 12; 0 12 12; 12 12 12; 0 12 12; 0 12 12; 0 12 12"
            keyTimes="0; 0.12; 0.25; 0.37; 0.5; 0.75; 1"
            dur="4s"
            repeatCount="indefinite"
            calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0 0 1 1; 0 0 1 1"
          />
        )}
        <line x1="6" x2="10" y1="11" y2="11" />
        <line x1="8" x2="8" y1="9" y2="13" />
        <line x1="15" x2="15.01" y1="12" y2="12">
          {playing && (
            <animate
              attributeName="opacity"
              values="1; 1; 0.15; 1; 1; 0.15; 1"
              keyTimes="0; 0.2; 0.3; 0.4; 0.6; 0.7; 1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <line x1="18" x2="18.01" y1="10" y2="10">
          {playing && (
            <animate
              attributeName="opacity"
              values="1; 1; 0.15; 1; 1; 0.15; 1"
              keyTimes="0; 0.4; 0.5; 0.6; 0.7; 0.8; 1"
              dur="2.4s"
              repeatCount="indefinite"
            />
          )}
        </line>
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      </g>
    </svg>
  )
}
