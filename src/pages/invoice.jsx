// pages/invoice.jsx
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useEffect } from "react";

export default function Invoice() {
  const { state } = useLocation();
  const { plan, payment_id, user } = state || {};

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Motor Law App Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${user?.first_name || "N/A"}`, 20, 40);
    doc.text(`Email: ${user?.email}`, 20, 50);
    doc.text(`Mobile: ${user?.mobile}`, 20, 60);
    doc.text(`Plan: ${plan?.name}`, 20, 70);
    doc.text(`Price: ₹${plan?.price}`, 20, 80);
    doc.text(`Duration: ${plan?.duration} month(s)`, 20, 90);
    doc.text(`Payment ID: ${payment_id}`, 20, 100);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 110);

    doc.save("Invoice.pdf");
  };

  useEffect(() => {
    if (!state) {
      window.location.href = "/";
    }
  }, [state]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">🎉 Payment Successful!</h1>
      <p className="mb-2">Thank you for your subscription.</p>
      <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Invoice Summary</h2>
        <p><strong>Name:</strong> {user?.first_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Mobile:</strong> {user?.mobile}</p>
        <p><strong>Plan:</strong> {plan?.name}</p>
        <p><strong>Amount Paid:</strong> ₹{plan?.price}</p>
        <p><strong>Payment ID:</strong> {payment_id}</p>
        <p><strong>Date:</strong> {new Date().toLocaleString()}</p>

        <button
          onClick={downloadPDF}
          className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
        >
          📥 Download PDF Invoice
        </button>
      </div>
    </div>
  );
}
