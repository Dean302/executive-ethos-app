import * as React from "react"

type SvgProps = React.ComponentProps<"svg">

/**
 * Base for square, currentColor icons. Sets the shared svg boilerplate so
 * each icon below is just its paths.
 */
function Icon({
  size = 16,
  viewBox = "0 0 24 24",
  children,
  ...props
}: SvgProps & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      aria-hidden
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

function ArrowRightIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </Icon>
  )
}

function ArrowUpIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </Icon>
  )
}

/** Google's mark — a fixed third-party brand asset, deliberately not themed. */
function GoogleIcon(props: React.ComponentProps<typeof Icon>) {
  return (
    <Icon size={18} {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Icon>
  )
}

export { Icon, ArrowRightIcon, ArrowUpIcon, GoogleIcon }
