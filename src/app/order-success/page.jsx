import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage({ searchParams }) {
  const orderNumber = searchParams?.orderNumber || "N/A";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-green-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Order Placed Successfully!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for your order. We will contact you soon to confirm delivery
          details.
        </p>

        {/* Order Number */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <p className="text-sm text-gray-600 mb-2">Order Number</p>
          <p className="text-2xl font-bold text-primary break-all">
            {orderNumber}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
          <ul className="text-sm text-blue-800 space-y-2 text-left">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>
                Our team will contact you within 24 hours to confirm your order
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>
                We'll provide delivery details and expected delivery date
              </span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Pay when your product arrives (Cash on Delivery)</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/admin"
            className="block w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            View Admin Dashboard
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Questions?</p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
              /\D/g,
              ""
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
