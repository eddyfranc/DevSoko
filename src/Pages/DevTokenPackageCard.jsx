import React from 'react';

const DevTokenPackageCard = ({ pkg, onBuy }) => {
   if (!pkg) return null; // prevent rendering if pkg is undefined
  return (
    <div className="p-4 border rounded-2xl shadow hover:shadow-lg transition-all">
      <h3 className="text-lg font-semibold">{pkg.name}</h3>
      <p>{pkg.connects} connects</p>
      <p className="text-green-600 font-bold">KES {pkg.price}</p>
      <button
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
        onClick={() => onBuy(pkg)}
      >
        Buy Now
      </button>
    </div>
  );
};

export default DevTokenPackageCard;
