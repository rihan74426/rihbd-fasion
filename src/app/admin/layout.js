import Link from "next/link";

export default async function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                {process.env.NEXT_PUBLIC_APP_NAME || "Admin Panel"}
              </h1>{" "}
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-primary"
                >
                  Orders
                </Link>
                <Link
                  href="/admin/products"
                  className="text-gray-700 hover:text-primary"
                >
                  Products
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-gray-700 hover:text-primary"
                >
                  Settings
                </Link>
                <Link href="/" className="text-gray-700 hover:text-primary">
                  View Shop
                </Link>
                {/* Logout performs server-side cookie clear - ensure route exists or create /api/admin/logout */}
                <a
                  href="/api/admin/logout"
                  className="text-red-600 hover:text-red-500 ml-4"
                >
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
