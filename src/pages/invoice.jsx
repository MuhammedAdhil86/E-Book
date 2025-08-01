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
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text(" Motor Law", leftMargin, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(90, 90, 90);
    y += 6;
    doc.text("123 Legal Street, Justice City, India", leftMargin, y);
    y += 5;
    doc.text("Email: support@motorlaw.com | Phone: +91-9876543210", leftMargin, y);

    // ===== INVOICE TITLE =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.text("INVOICE", 190 - leftMargin, 20, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text(`Invoice #: ${payment_id || "N/A"}`, 190 - leftMargin, 28, { align: "right" });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 190 - leftMargin, 34, { align: "right" });

    // ===== BILL TO =====
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Billed To:", leftMargin, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const fullName = user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    doc.text(fullName || "N/A", leftMargin, y);
    y += 5;
    doc.text(user?.email || "N/A", leftMargin, y);
    y += 5;
    doc.text(user?.mobile || "N/A", leftMargin, y);

    // ===== PLAN DETAILS BOX =====
    y += 10;
    doc.setDrawColor(230);
    doc.setLineWidth(0.2);
    doc.rect(leftMargin, y, 170, 60);

    y += 8;
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
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("Subscription Details", labelX, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    rows.forEach(([label, value]) => {
      doc.setTextColor(60, 60, 60);
      doc.text(`${label}:`, labelX, y);
      doc.text(`${value}`, valueX, y);
      y += 8;
    });

    // ===== TOTAL =====
    y += 5;
    doc.setLineWidth(0.3);
    doc.setDrawColor(180);
    doc.line(labelX, y, 190, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Total Amount", labelX, y);
    doc.text(`₹${plan?.price}`, valueX, y);

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

    doc.save(`Invoice_${payment_id || "MotorLaw"}.pdf`);
  };

  useEffect(() => {
    if (!state) {
      window.location.href = "/";
    }
  }, [state]);

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white py-10 px-4 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-300 relative">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-green-700 mb-2">
          ✅ Payment Successful!
        </h1>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Thank you for your subscription.
        </p>

        {/* Invoice Box */}
        <div className="border border-dashed border-yellow-400 p-6 rounded-xl bg-yellow-50 shadow-inner">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
            Invoice Summary
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 text-sm">
            <div>
              <p className="font-medium">👤 Full Name:</p>
              <p>{user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`}</p>
            </div>
            <div>
              <p className="font-medium">📧 Email:</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="font-medium">📱 Mobile:</p>
              <p>{user?.mobile}</p>
            </div>
            <div>
              <p className="font-medium">📦 Plan:</p>
              <p>{plan?.name}</p>
            </div>
            <div>
              <p className="font-medium">💰 Amount Paid:</p>
              <p>₹{plan?.price}</p>
            </div>
            <div>
              <p className="font-medium">⏱ Duration:</p>
              <p>{plan?.duration} month(s)</p>
            </div>
            <div>
              <p className="font-medium">🧾 Payment ID:</p>
              <p>{payment_id}</p>
            </div>
            <div>
              <p className="font-medium">📅 Date:</p>
              <p>{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow"
          >
            ⬅ Back to Home
          </button>

          <button
            onClick={downloadPDF}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow"
          >
            📥 Download PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
