import Image from "next/image"

import { Logo } from "@/components/common/logo"

import { ProductGlimpse } from "./ProductGlimpse"

// Real credentials of the practice, from the brand guidelines.
const CREDENTIALS = [
  { name: "ILM Level 7", detail: "Executive Coaching" },
  { name: "ICF ACC", detail: "credentialed" },
  { name: "Leadership OS", detail: "integrated" },
]

/**
 * The navy brand side of the auth screens: the brand's one-line promise
 * over a dusk landscape, with the product sitting in the scene. Desktop
 * only — on small screens the form stands alone.
 */
function AuthBrandPanel() {
  return (
    <aside
      aria-label="About Executive Ethos"
      className="bg-primary text-primary-foreground relative hidden overflow-hidden rounded-[28px] px-12 py-10 lg:flex lg:w-[54%] lg:flex-col lg:justify-between"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* "A view of a mountain range at dusk", Almkogel, Austria, by
            Leonie Zettl on Unsplash (Unsplash License). The 1px size
            below lg keeps small screens, where the panel is hidden, on
            the smallest variant. */}
        <Image
          src="/images/signin-dusk.jpg"
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 1024px) 54vw, 1px"
          className="object-cover object-bottom"
        />
        {/* A navy wash keeps the headline crisp; the darker foot carries
            the credentials. */}
        <div className="from-navy-deep/85 via-primary/35 to-navy-deep/30 absolute inset-0 bg-linear-to-b" />
        <div className="from-navy-deep/70 absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-t to-transparent" />
      </div>

      <Logo surface="dark" height={28} className="relative" />

      <p className="font-heading relative max-w-lg text-4xl leading-[1.1] font-normal text-balance xl:text-[2.9rem]">
        The AI tells you the truth. We help you do{" "}
        <em className="text-accent">something</em> about it.
      </p>

      <ProductGlimpse />

      <ul className="text-primary-foreground/60 relative flex flex-wrap gap-7 text-sm">
        {CREDENTIALS.map(({ name, detail }) => (
          <li key={name}>
            <b className="text-primary-foreground font-semibold">{name}</b> {detail}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export { AuthBrandPanel }
