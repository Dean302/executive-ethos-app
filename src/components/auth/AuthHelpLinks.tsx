import Link from "next/link"

type AuthHelpLinksProps = {
  /** Lead-in before the link, e.g. "New here?" */
  prompt: string
  linkLabel: string
  href: string
}

/** The two help lines under every auth form. */
function AuthHelpLinks({ prompt, linkLabel, href }: AuthHelpLinksProps) {
  return (
    <div className="text-muted-foreground mt-6 flex flex-col gap-1.5 text-sm">
      <p>
        {prompt}{" "}
        <Link
          href={href}
          className="text-foreground font-medium underline-offset-4 hover:underline"
        >
          {linkLabel}
        </Link>
      </p>
      <p>Trouble signing in? Reach out to your coach.</p>
    </div>
  )
}

export { AuthHelpLinks }
