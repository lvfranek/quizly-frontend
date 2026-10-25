import styles from './RobotLogo.module.css'

type RobotLogoProps = {
  size?: number
  /** Pops in and winks, used on the intro page */
  animated?: boolean
  className?: string
}

export function RobotLogo({ size = 28, animated = false, className = '' }: RobotLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${styles.robot} ${animated ? styles.animated : ''} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M22 21 C19 17 15 15 12 13"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="11" cy="12" r="5" fill="currentColor" />
      <rect
        x="8"
        y="21"
        width="48"
        height="36"
        rx="13"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <ellipse cx="27" cy="36" rx="4.5" ry="5.5" fill="currentColor" />
      <ellipse className={styles.winkEye} cx="41" cy="36" rx="4.5" ry="5.5" fill="currentColor" />
      <path d="M27 45 Q34 52 41 45 Z" fill="currentColor" />
    </svg>
  )
}
