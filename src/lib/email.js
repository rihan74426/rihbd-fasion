// src/lib/email.js
// Email notification utility using nodemailer
// Works with Gmail (use App Password) or any SMTP provider

import nodemailer from "nodemailer";

function createTransporter() {
  const host = process.env.EMAIL_HOST;
  const service = process.env.EMAIL_SERVICE; // "gmail" shortcut

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "EMAIL_USER and EMAIL_PASS must be set in environment variables"
    );
  }

  if (service) {
    // Service shortcut (e.g. "gmail")
    return nodemailer.createTransporter({
      service,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Full SMTP config
  return nodemailer.createTransporter({
    host: host || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

/**
 * Send order notification email to admin.
 * Called after a new order is successfully created.
 * Failure is non-blocking — the order is saved regardless.
 */
export async function sendOrderNotification({
  orderNumber,
  customerName,
  customerPhone,
  customerAddress,
  productName,
  productPrice,
  selectedSize,
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn("ADMIN_EMAIL not set — skipping order notification email");
    return;
  }

  const appName = process.env.NEXT_PUBLIC_APP_NAME || "Rihbd Fashion";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Format price as ৳ amount
  const formattedPrice = `৳${Number(productPrice).toLocaleString("en-BD")}`;

  const transporter = createTransporter();

  const subject = `🛒 New Order ${orderNumber} — ${appName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#062a5f,#0b3d91);padding:28px 32px;">
      <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.02em;">New Order Received</h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px;">${appName}</p>
    </div>

    <!-- Order number banner -->
    <div style="background:#faf8f4;border-bottom:1px solid #eae7df;padding:16px 32px;display:flex;align-items:center;justify-content:space-between;">
      <div>
        <p style="margin:0;font-size:11px;font-weight:600;color:#d4af37;letter-spacing:0.08em;text-transform:uppercase;">Order Number</p>
        <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#0b3d91;">${orderNumber}</p>
      </div>
      <div style="background:#d1fae5;border-radius:8px;padding:6px 12px;">
        <p style="margin:0;font-size:12px;font-weight:600;color:#065f46;">PENDING</p>
      </div>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">

      <!-- Product section -->
      <div style="background:#f8f6f1;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-size:11px;font-weight:600;color:#888;letter-spacing:0.06em;text-transform:uppercase;">Product Ordered</p>
        <p style="margin:0 0 6px;font-size:17px;font-weight:700;color:#1a1a2e;">${productName}</p>
        <div style="display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;">
          <div>
            <p style="margin:0;font-size:11px;color:#888;">Price</p>
            <p style="margin:2px 0 0;font-size:16px;font-weight:800;color:#0b3d91;">${formattedPrice}</p>
          </div>
          ${
            selectedSize
              ? `
          <div>
            <p style="margin:0;font-size:11px;color:#888;">Size</p>
            <p style="margin:2px 0 0;font-size:15px;font-weight:700;color:#0b3d91;">${selectedSize}</p>
          </div>`
              : ""
          }
          <div>
            <p style="margin:0;font-size:11px;color:#888;">Payment</p>
            <p style="margin:2px 0 0;font-size:13px;font-weight:600;color:#065f46;">Cash on Delivery</p>
          </div>
        </div>
      </div>

      <!-- Customer section -->
      <div style="margin-bottom:24px;">
        <p style="margin:0 0 14px;font-size:11px;font-weight:600;color:#888;letter-spacing:0.06em;text-transform:uppercase;">Customer Details</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0ede6;width:36%;">
              <p style="margin:0;font-size:12px;color:#888;">Name</p>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #f0ede6;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a2e;">${customerName}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f0ede6;">
              <p style="margin:0;font-size:12px;color:#888;">Phone</p>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #f0ede6;">
              <p style="margin:0;font-size:14px;font-weight:600;color:#1a1a2e;">${customerPhone}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;">
              <p style="margin:0;font-size:12px;color:#888;">Address</p>
            </td>
            <td style="padding:8px 0;">
              <p style="margin:0;font-size:13px;color:#444;line-height:1.5;">${customerAddress}</p>
            </td>
          </tr>
        </table>
      </div>

      <!-- Action buttons -->
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <a href="${appUrl}/admin" style="display:inline-block;background:linear-gradient(135deg,#0b3d91,#062a5f);color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">
          View in Admin Panel
        </a>
        <a href="https://wa.me/${(
          process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
        ).replace(/^\+/, "")}?text=${encodeURIComponent(
    `Hi ${customerName}, your order ${orderNumber} has been received. We'll confirm shortly!`
  )}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">
          WhatsApp Customer
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#0a0f1e;padding:16px 32px;text-align:center;">
      <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;">${appName} — Admin Notification</p>
    </div>
  </div>
</body>
</html>`;

  const text = `
New Order: ${orderNumber}

Product: ${productName}
Price: ${formattedPrice}${selectedSize ? `\nSize: ${selectedSize}` : ""}
Payment: Cash on Delivery

Customer: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

View orders: ${appUrl}/admin
`;

  await transporter.sendMail({
    from: `"${appName}" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject,
    html,
    text,
  });

  console.log(
    `✅ Order notification sent to ${adminEmail} for order ${orderNumber}`
  );
}
