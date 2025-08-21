import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useEffect } from "react";

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { plan, payment_id, user } = state || {};

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const leftMargin = 20;
    let y = 20;

// ===== HEADER BAR =====
doc.setFillColor(255, 225, 53);
doc.rect(0, 0, pageWidth, 40, "F"); // Increased height for more padding

doc.setFont("helvetica", "bold");
doc.setFontSize(20);
doc.setTextColor(0, 0, 0); // Black text for good contrast
doc.text("Motor Law", leftMargin, 20);

doc.setFontSize(10);
doc.setFont("helvetica", "normal");
doc.text("123 Legal Street, Justice City, India", leftMargin, 28);
doc.text("support@motorlaw.com | +91-9876543210", leftMargin, 34);

// ===== INVOICE TITLE =====
doc.setFont("helvetica", "bold");
doc.setFontSize(18);
doc.setTextColor(0, 0, 0);
doc.text("INVOICE", pageWidth - leftMargin, 20, { align: "right" });

doc.setFont("helvetica", "normal");
doc.setFontSize(11);
doc.setTextColor(50, 50, 50);
doc.text(`Invoice #: ${payment_id || "N/A"}`, pageWidth - leftMargin, 28, { align: "right" });
doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - leftMargin, 34, { align: "right" });

    // ===== BILL TO =====
    y = 50;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Billed To:", leftMargin, y);

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    const fullName = user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    doc.text(fullName || "N/A", leftMargin, y);
    y += 6;
    doc.text(user?.email || "N/A", leftMargin, y);
    y += 6;
    doc.text(user?.mobile || "N/A", leftMargin, y);

    // ===== DETAILS BOX =====
    y += 15;
    doc.setDrawColor(180);
    doc.setLineWidth(0.4);
    doc.roundedRect(leftMargin, y, pageWidth - 2 * leftMargin, 65, 3, 3);

    y += 10;
    const labelX = leftMargin + 8;
    const valueX = pageWidth / 2;

    const rows = [
      ["Plan Name", plan?.name || "N/A"],
      ["Duration", `${plan?.duration} month(s)`],
      ["Amount Paid", `Rs.${plan?.price}`],
      ["Payment ID", payment_id || "N/A"],
      ["Date of Payment", new Date().toLocaleString()],
    ];

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(34, 34, 34);
    doc.text("Subscription Details", labelX, y);

    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    rows.forEach(([label, value]) => {
      doc.setTextColor(60, 60, 60);
      doc.text(`${label}:`, labelX, y);
      doc.setTextColor(20, 20, 20);
      doc.text(`${value}`, valueX, y);
      y += 8;
    });

    // ===== TOTAL =====
    y += 5;
    doc.setDrawColor(200);
    doc.line(labelX, y, pageWidth - leftMargin, y);
    y += 10;

    doc.setFillColor(255, 230, 150); // soft yellow box
    doc.roundedRect(labelX, y - 6, pageWidth - leftMargin - labelX, 12, 2, 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text("Total Amount", labelX + 3, y + 2);
    doc.text(`Rs.${plan?.price}`, valueX, y + 2);

    // ===== FOOTER =====
    y += 30;
    doc.setDrawColor(220);
    doc.line(leftMargin, y, pageWidth - leftMargin, y);

    y += 10;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      "Thank you for subscribing to Motor Law. Please contact support for any queries.",
      pageWidth / 2,
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
              <p className="font-medium">Full Name:</p>
              <p>{user?.full_name || `${user?.first_name || ""} ${user?.last_name || ""}`}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="font-medium">Mobile:</p>
              <p>{user?.mobile}</p>
            </div>
            <div>
              <p className="font-medium">Plan:</p>
              <p>{plan?.name}</p>
            </div>
            <div>
              <p className="font-medium">Amount Paid:</p>
              <p>Rs.{plan?.price}</p>
            </div>
            <div>
              <p className="font-medium">Duration:</p>
              <p>{plan?.duration} month(s)</p>
            </div>
            <div>
              <p className="font-medium">Payment ID:</p>
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
            Back to Home
          </button>

          <button
            onClick={downloadPDF}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg shadow"
          >
            Download PDF Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
