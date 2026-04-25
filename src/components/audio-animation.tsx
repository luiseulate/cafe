interface Props {
  playing: boolean
}

export default function AudioAnimation({ playing }: Props) {
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
