interface Props {
  playing: boolean
}

export default function AudioAnimation({ playing }: Props) {
  return (
    <svg
      className="flex-none will-change-transform"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      height="20"
      role="presentation"
      width="20"
    >
      {playing ? (
        <>
          <rect height="8" rx="1" width="2" x="3" y="6">
            <animate
              attributeName="height"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="8;4;2;6;4;8"
            />
            <animate
              attributeName="y"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="6;8;9;7;8;6"
            />
          </rect>
          <rect height="12" rx="1" width="2" x="7" y="4">
            <animate
              attributeName="height"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="12;8;10;8;14;12"
            />
            <animate
              attributeName="y"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="4;6;5;6;3;4"
            />
          </rect>
          <rect height="6" rx="1" width="2" x="11" y="7">
            <animate
              attributeName="height"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="6;8;6;10;8;6"
            />
            <animate
              attributeName="y"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="7;6;7;5;6;7"
            />
          </rect>
          <rect height="8" rx="1" width="2" x="15" y="6">
            <animate
              attributeName="height"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="8;4;6;4;2;8"
            />
            <animate
              attributeName="y"
              calcMode="linear"
              dur="1s"
              repeatCount="indefinite"
              values="6;8;7;8;9;6"
            />
          </rect>
        </>
      ) : (
        <path
          clipRule="evenodd"
          d="M16 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1ZM12 7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1ZM8 4a1 1 0 0 1 1 1v10a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1ZM4 6a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0V7a1 1 0 0 1 1-1Z"
          fillRule="evenodd"
        />
      )}
    </svg>
  )
}
