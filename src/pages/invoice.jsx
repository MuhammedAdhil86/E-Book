import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useEffect } from "react";

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { plan, payment_id, user } = state || {};

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const leftMargin = 20;
    let y = 20;

    // ===== HEADER =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Motor Law", leftMargin, y);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text("123 Legal Street, Justice City, India", leftMargin, y);
    y += 5;
    doc.text("Email: support@motorlaw.com | Phone: +91-9876543210", leftMargin, y);

    // ===== INVOICE TITLE =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("INVOICE", 170, 20, { align: "right" });

    // ===== INVOICE INFO =====
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${payment_id || "N/A"}`, 170, 28, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 170, 34, { align: "right" });

    // ===== BILL TO =====
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`${user?.first_name || "N/A"}`, leftMargin, y);
    y += 5;
    doc.text(`${user?.email || "N/A"}`, leftMargin, y);
    y += 5;
    doc.text(`${user?.mobile || "N/A"}`, leftMargin, y);

    // ===== DRAWING BOX =====
    y += 10;
    doc.setDrawColor(200);
    doc.setLineWidth(0.1);
    doc.rect(leftMargin, y, 170, 60);

    // ===== PLAN INFO TABLE =====
    y += 8;
    const tableStartY = y;
    const labelX = leftMargin + 5;
    const valueX = 100;

    const rows = [
      ["Plan Name", plan?.name || "N/A"],
      ["Duration", `${plan?.duration} month(s)`],
      ["Amount Paid", `₹${plan?.price}`],
      ["Payment ID", payment_id || "N/A"],
      ["Date of Payment", new Date().toLocaleString()],
    ];

    doc.setFont("helvetica", "bold");
    doc.text("Subscription Details", labelX, y);
    doc.setFont("helvetica", "normal");

    y += 7;
    rows.forEach(([label, value]) => {
      doc.text(`${label}:`, labelX, y);
      doc.text(`${value}`, valueX, y);
      y += 8;
    });

    // ===== TOTAL SECTION =====
    y = tableStartY + 50;
    doc.setLineWidth(0.2);
    doc.line(labelX, y, 190, y);

    doc.setFont("helvetica", "bold");
    doc.text("Total Amount", labelX, y + 8);
    doc.text(`₹${plan?.price}`, valueX, y + 8);

    // ===== FOOTER =====
    y += 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Thank you for subscribing to Motor Law. Please contact support for any queries.",
      105,
      y,
      { align: "center" }
    );

    doc.save("MotorLaw_Invoice.pdf");
  };

  useEffect(() => {
    if (!state) {
      window.location.href = "/";
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl border border-gray-300 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ⬅ Back to Home
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          ✅ Payment Successful!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Thank you for your subscription.
        </p>

        {/* Invoice Content */}
        <div className="border border-dashed p-6 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Invoice Summary
          </h2>

          <div className="grid grid-cols-2 gap-4 text-gray-800 text-sm">
            <div>
              <p>
                <strong>👤 Name:</strong>
              </p>
              <p>{user?.first_name || "N/A"}</p>
            </div>
            <div>
              <p>
                <strong>📧 Email:</strong>
              </p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p>
                <strong>📱 Mobile:</strong>
              </p>
              <p>{user?.mobile}</p>
            </div>
            <div>
              <p>
                <strong>📦 Plan:</strong>
              </p>
              <p>{plan?.name}</p>
            </div>
            <div>
              <p>
                <strong>💰 Amount Paid:</strong>
              </p>
              <p>₹{plan?.price}</p>
            </div>
            <div>
              <p>
                <strong>⏱ Duration:</strong>
              </p>
              <p>{plan?.duration} month(s)</p>
            </div>
            <div>
              <p>
                <strong>🧾 Payment ID:</strong>
              </p>
              <p>{payment_id}</p>
            </div>
            <div>
              <p>
                <strong>📅 Date:</strong>
              </p>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={downloadPDF}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded shadow"
            >
              📥 Download PDF Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
