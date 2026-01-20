"use client";

export default function LeadsTable({ leads }: { leads: any[] }) {
  const downloadCSV = () => {
    if (!leads.length) return alert("No hay leads para exportar");

    // 1. Aplanar el JSONB para el CSV (ej: data.email -> email)
    const flatLeads = leads.map((l) => ({
      fecha: new Date(l.created_at).toLocaleDateString(),
      ...l.data, // Esto expande el json { nombre: '...', email: '...' }
    }));

    // 2. Crear cabeceras dinámicas
    const headers = Object.keys(flatLeads[0]).join(",");

    // 3. Crear filas
    const rows = flatLeads
      .map((obj) =>
        Object.values(obj)
          .map((v) => `"${v}"`)
          .join(","),
      )
      .join("\n");

    // 4. Generar blob y descargar
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mis_leads.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mt-8">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-bold text-lg">Últimos Contactos</h3>
        <button
          onClick={downloadCSV}
          className="text-xs bg-green-600/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded hover:bg-green-600/30 transition"
        >
          Descargar CSV
        </button>
      </div>

      {!leads.length ? (
        <div className="p-8 text-center text-gray-500">
          Aún no tienes leads capturados. Comparte tu landing.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="bg-white/5 text-gray-200 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Fecha</th>
                {/* Asumimos que el primer lead tiene las llaves comunes */}
                {Object.keys(leads[0].data).map((key) => (
                  <th key={key} className="px-6 py-3">
                    {key}
                  </th>
                ))}
                <th className="px-6 py-3">Acción</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </td>
                  {Object.values(lead.data).map((val: any, i) => (
                    <td key={i} className="px-6 py-4">
                      {val}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${lead.data.email}`}
                      className="text-blue-400 hover:underline"
                    >
                      Contactar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
