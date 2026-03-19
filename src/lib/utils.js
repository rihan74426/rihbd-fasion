// lib/utils.js
// Essential utility functions

/**
 * Format price in Bangladeshi Taka
 */
export function formatPrice(price) {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `৳${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

/**
 * Format date for display
 */
export function formatDate(date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Generate unique order number
 */
export function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${timestamp}-${random}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price, salePrice) {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/**
 * Truncate text to length
 */
export function truncateText(text, length) {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Validate Bangladesh phone number
 */
export function isValidPhone(phone) {
  const phoneRegex = /^(\+?880|0)?1[3-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Format phone for WhatsApp (remove spaces, add country code)
 */
export function formatPhoneForWhatsApp(phone) {
  let cleaned = phone.replace(/\D/g, "");

  if (cleaned.startsWith("0")) {
    cleaned = "880" + cleaned.substring(1);
  } else if (!cleaned.startsWith("880")) {
    cleaned = "880" + cleaned;
  }

  return cleaned;
}

/**
 * Get order status badge color
 */
export function getOrderStatusColor(status) {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
