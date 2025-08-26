import PanelSuperior from '../home/components/PanelSuperior';

const notifications = [
  { id: 1, title: '¡Promo especial!', message: '20% de descuento en zapatillas.', type: 'promo', date: '2025-08-21' },
  { id: 2, title: '¡Producto disponible!', message: 'Tu talla está de vuelta en stock.', type: 'stock', date: '2025-08-20' },
  { id: 3, title: 'Envío en camino', message: 'Tu pedido ha sido enviado.', type: 'shipping', date: '2025-08-19' },
];

export default function NotificationsPage() {
  return (
    <main className="min-h-screen pb-20">
  <PanelSuperior pageTitle="Dozur Shop" />
      <section className="px-4 mt-4">
        <h2 className="text-white text-lg font-bold mb-2">Notificaciones</h2>
        <ul className="space-y-4">
          {notifications.map(n => (
            <li key={n.id} className="bg-gray-900 rounded-xl p-4 shadow-soft">
              <div className="text-neon font-semibold">{n.title}</div>
              <div className="text-white text-sm">{n.message}</div>
              <div className="text-gray-400 text-xs mt-1">{n.date}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
