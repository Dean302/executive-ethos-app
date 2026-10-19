import { Logo } from "@/components/common/logo"

import { AuthBrandPanel } from "./AuthBrandPanel"

/** Split layout shared by the auth screens: brand panel left, form right. */
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-dvh lg:h-dvh lg:p-3">
      <AuthBrandPanel />

      <main className="flex flex-1 items-center justify-center overflow-y-auto px-5 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          {/* The brand panel carries the logo on desktop. */}
          <Logo height={24} className="mb-10 lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  )
}

export { AuthLayout }
