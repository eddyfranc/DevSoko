import React from "react";

const Sales = ({ user }) => {
  const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
  const mySales = purchases.filter(
    (p) => p.sellerEmail === user.email
  );

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Your Sales</h3>
      {mySales.length === 0 ? (
        <p className="text-gray-500">No sales yet.</p>
      ) : (
        <ul className="space-y-3">
          {mySales.map((sale, idx) => (
            <li key={idx} className="border p-4 rounded bg-white shadow">
              <p className="font-semibold">Project ID: {sale.projectId}</p>
              <p className="text-sm text-gray-600">Bought by: {sale.buyerEmail}</p>
              <p className="text-sm text-gray-600">Amount: KES {sale.price}</p>
              <p className="text-sm text-gray-500">Date: {new Date(sale.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sales;
