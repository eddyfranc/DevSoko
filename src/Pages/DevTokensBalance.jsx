const DevTokensBalance = ({ DevTokens }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">Your DevTokens</h2>
      <p className="text-3xl text-blue-600 font-bold">{DevTokens}</p>
    </div>
  );
};

export default DevTokensBalance;


