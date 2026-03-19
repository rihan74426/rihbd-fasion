// src/app/admin/customers/page.jsx
import connectDB from "@/lib/mongodb";
import Order from "@/models/Order";
import { formatDate, formatPrice } from "@/lib/utils";

async function getCustomers() {
  try {
    await connectDB();

    // Get all orders, group by phone number
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    // Build customer map keyed by phone
    const customerMap = {};
    for (const order of orders) {
      const phone = order.customerPhone;
      if (!customerMap[phone]) {
        customerMap[phone] = {
          name: order.customerName,
          phone,
          orders: [],
          totalSpent: 0,
          firstSeen: order.createdAt,
          lastSeen: order.createdAt,
        };
      }
      const c = customerMap[phone];
      c.orders.push(order);
      if (order.status !== "CANCELLED") {
        c.totalSpent += order.productPrice || 0;
      }
      if (new Date(order.createdAt) > new Date(c.lastSeen)) {
        c.lastSeen = order.createdAt;
      }
    }

    // Sort by most recent
    return Object.values(customerMap).sort(
      (a, b) => new Date(b.lastSeen) - new Date(a.lastSeen)
    );
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.orders.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600">All customers who have placed orders</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 mb-1">Total Customers</p>
          <p className="text-3xl font-bold text-gray-900">{totalCustomers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(totalRevenue)}
          </p>
        </div>
      </div>

      {/* Customers table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Customer List</h2>
          <span className="text-sm text-gray-500">
            {totalCustomers} customers
          </span>
        </div>

        {customers.length === 0 ? (
          <div className="text-center py-16">
            <svg
              className="w-12 h-12 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-500 text-lg">No customers yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Customers will appear here once orders are placed
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => {
                  const pendingCount = customer.orders.filter(
                    (o) => o.status === "PENDING"
                  ).length;
                  const deliveredCount = customer.orders.filter(
                    (o) => o.status === "DELIVERED"
                  ).length;
                  // Build WhatsApp number — strip leading 0 and add 880
                  let waNumber = customer.phone.replace(/\s/g, "");
                  if (waNumber.startsWith("0"))
                    waNumber = "880" + waNumber.slice(1);
                  else if (!waNumber.startsWith("880"))
                    waNumber = "880" + waNumber;

                  return (
                    <tr
                      key={customer.phone}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Name + avatar */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0"
                            style={{ background: "#0b3d91" }}
                          >
                            <span className="text-white text-sm font-bold">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              Since {formatDate(customer.firstSeen)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-700">
                          {customer.phone}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-gray-900">
                            {customer.orders.length} total
                          </span>
                          <div className="flex gap-1.5">
                            {pendingCount > 0 && (
                              <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-yellow-100 text-yellow-700 font-medium">
                                {pendingCount} pending
                              </span>
                            )}
                            {deliveredCount > 0 && (
                              <span className="inline-block px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700 font-medium">
                                {deliveredCount} done
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Total spent */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(customer.totalSpent)}
                        </span>
                      </td>

                      {/* Last order */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-700">
                            {formatDate(customer.lastSeen)}
                          </p>
                          <p className="text-xs text-gray-400 truncate max-w-[140px]">
                            {customer.orders[0]?.productName}
                          </p>
                        </div>
                      </td>

                      {/* WhatsApp contact */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
                            `Hi ${customer.name}! This is Rihbd Fashion. We're reaching out regarding your order.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold transition-all hover:scale-105 hover:shadow-md"
                          style={{ background: "#25D366" }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.6 12.6 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
