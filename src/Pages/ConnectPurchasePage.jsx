import ConnectBalance from './ConnectBalance';
import ConnectPackageCard from './ConnectPackageCard';

const ConnectPurchasePage = () => {
  const [connects, setConnects] = useState(5); // Default user connects
  const packages = [
    { id: 1, name: 'Starter', connects: 10, price: 100 },
    { id: 2, name: 'Pro', connects: 50, price: 450 },
    { id: 3, name: 'Elite', connects: 100, price: 800 },
  ];

  const handleBuy = (pkg) => {
    // Simulate successful purchase
    alert(`You purchased ${pkg.connects} connects`);
    setConnects(connects + pkg.connects);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ConnectBalance connects={connects} />

      <h2 className="mt-6 mb-4 text-2xl font-semibold">Buy Connects</h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {packages.map((pkg) => (
          <ConnectPackageCard key={pkg.id} pkg={pkg} onBuy={handleBuy} />
        ))}
      </div>
    </div>
  );
};

export default ConnectPurchasePage;
