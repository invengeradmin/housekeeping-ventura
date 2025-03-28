import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-center">
          <Image
            src="/images/logo.png"
            alt="Ventura Grand Inn Logo"
            width={240}
            height={80}
            priority
            className="h-auto"
          />
        </div>

        <form className="mt-8 space-y-6" action="/dashboard">
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-ventura-gold hover:bg-ventura-goldDark text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

