import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useEffect } from "react";

export default function Invoice() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { plan, payment_id, user } = state || {};

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Motor Law App - Invoice", 105, 20, { align: "center" });

    // Draw outer border
    doc.setLineWidth(0.5);
    doc.rect(10, 30, 190, 130); // x, y, width, height

    // Section title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details", 15, 42);

    // Draw underline
    doc.line(15, 44, 195, 44);

    // Labels and Values
    const fields = [
      ["Customer Name", user?.first_name || "N/A"],
      ["Email", user?.email || "N/A"],
      ["Mobile", user?.mobile || "N/A"],
      ["Plan", plan?.name || "N/A"],
      ["Amount Paid", `₹${plan?.price}`],
      ["Duration", `${plan?.duration} month(s)`],
      ["Payment ID", payment_id || "N/A"],
      ["Date", new Date().toLocaleString()],
    ];

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    let y = 55;
    fields.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, y);
      doc.text(`${value}`, 80, y);
      y += 10;
    });

    // Footer/Thank you
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for your payment!", 105, 170, { align: "center" });

    doc.save("Invoice.pdf");
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
        <p className="text-center text-gray-600 mb-6">Thank you for your subscription.</p>

        {/* Invoice Content */}
        <div className="border border-dashed p-6 rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Invoice Summary</h2>

          <div className="grid grid-cols-2 gap-4 text-gray-800 text-sm">
            <div>
              <p><strong>👤 Name:</strong></p>
              <p>{user?.first_name || "N/A"}</p>
            </div>
            <div>
              <p><strong>📧 Email:</strong></p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p><strong>📱 Mobile:</strong></p>
              <p>{user?.mobile}</p>
            </div>
            <div>
              <p><strong>📦 Plan:</strong></p>
              <p>{plan?.name}</p>
            </div>
            <div>
              <p><strong>💰 Amount Paid:</strong></p>
              <p>₹{plan?.price}</p>
            </div>
            <div>
              <p><strong>⏱ Duration:</strong></p>
              <p>{plan?.duration} month(s)</p>
            </div>
            <div>
              <p><strong>🧾 Payment ID:</strong></p>
              <p>{payment_id}</p>
            </div>
            <div>
              <p><strong>📅 Date:</strong></p>
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
