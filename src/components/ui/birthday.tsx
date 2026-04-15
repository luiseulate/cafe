import { useEffect, useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

interface BirthdayInfoProps {
  birthday: Date
}

export default function Birthday({ birthday }: BirthdayInfoProps) {
  const [dayOf365, setDayOf365] = useState(0)
  const [age, setAge] = useState('00.000000000')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const MS_PER_DAY = 1000 * 60 * 60 * 24
    const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25
    const UPDATE_INTERVAL = 75

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const currentYear = today.getFullYear()

    const thisYearBirthday = new Date(
      currentYear,
      birthday.getMonth(),
      birthday.getDate(),
    )

    const lastBirthday =
      today < thisYearBirthday
        ? new Date(currentYear - 1, birthday.getMonth(), birthday.getDate())
        : thisYearBirthday

    const daysSinceBirthday = Math.floor(
      (today.getTime() - lastBirthday.getTime()) / MS_PER_DAY,
    )

    const calculatedDayOf365 = Math.min(
      daysSinceBirthday === 0 ? 365 : daysSinceBirthday,
      365,
    )

    setDayOf365(calculatedDayOf365)

    const birthdayTimestamp = birthday.getTime()

    const calculateAge = () => {
      const now = Date.now()
      const ageInMilliseconds = now - birthdayTimestamp
      const ageInYears = ageInMilliseconds / MILLISECONDS_PER_YEAR
      return ageInYears.toLocaleString('es-ES', {
        minimumFractionDigits: 9,
        maximumFractionDigits: 9,
      })
    }

    setAge(calculateAge())
    setIsLoading(false)

    const intervalId = window.setInterval(() => {
      setAge(calculateAge())
    }, UPDATE_INTERVAL)

    return () => window.clearInterval(intervalId)
  }, [birthday])

  const heartsProgress = (dayOf365 / 365) * 5

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-1">
        <Skeleton className="h-5 w-53" />
        <Skeleton className="h-[19px] w-[96px]" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
        <span className="tabular-nums">Lv. {age}</span>
        <Separator orientation="vertical" className="h-4!" />
        <span className="tabular-nums">Exp. {dayOf365}/365</span>
      </div>
      <div className="flex items-center">
        <div
          aria-label={`${heartsProgress} de 5`}
          className="relative -ml-px h-[19px] w-[96px]"
          role="img"
          title={`${heartsProgress} de 5`}
        >
          <svg
            className="text-muted-foreground/20 absolute"
            width="96"
            height="19"
            viewBox="0 0 120 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(0 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(24 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(48 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(72 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(96 0)"
              fill="currentColor"
            />
          </svg>

          <svg
            className="text-muted-foreground/60 absolute"
            width="96"
            height="19"
            viewBox="0 0 120 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              clipPath: `inset(0 ${100 - (heartsProgress / 5) * 100}% 0 0)`,
            }}
          >
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(0 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(24 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(48 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(72 0)"
              fill="currentColor"
            />
            <path
              d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037.033.034-.03a6 6 0 0 1 4.733-1.44l.246.036a6 6 0 0 1 3.364 10.008l-.18.185-.048.041-7.45 7.379a1 1 0 0 1-1.313.082l-.094-.082-7.493-7.422a6 6 0 0 1 3.176-10.215z"
              transform="translate(96 0)"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
