interface Props {
  totalProducts: number;
  totalReservations: number;
  pendingReservations: number;
  lowStockProducts: number;
  totalStock: number;
}

export default function StatsCards({
  totalProducts,
  totalReservations,
  pendingReservations,
  lowStockProducts,
  totalStock,
}: Props) {
  const stats = [
    {
      title: "Products",
      value: totalProducts,
      color: "bg-blue-600",
    },

    {
      title: "Reservations",
      value: totalReservations,
      color: "bg-green-600",
    },

    {
      title: "Pending",
      value: pendingReservations,
      color: "bg-yellow-500",
    },

    {
      title: "Low Stock",
      value: lowStockProducts,
      color: "bg-red-600",
    },

    {
      title: "Total Stock",
      value: totalStock,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`${stat.color} rounded-3xl p-8 hover:scale-[1.03] transition-all duration-300`}
        >
          <h2 className="text-3xl font-bold">
            {stat.title}
          </h2>

          <p className="text-6xl font-bold mt-6">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}