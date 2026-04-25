interface Props {
  reading: boolean
}

export default function BookAnimation({ reading }: Props) {
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
        {reading && (
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
        {reading && (
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
        {reading && (
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
        {reading && (
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
