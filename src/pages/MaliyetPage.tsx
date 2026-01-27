import { useEffect, useState } from "react";
import { ReceteApi } from "../services/receteApi";
import { ReceteHammaddeApi } from "../services/receteHammaddeApi";
import { TfRecete, TfHammaddeRecete } from "../types/models";

export default function MaliyetPage() {
  const [receteler, setReceteler] = useState<TfRecete[]>([]);
  const [detaylar, setDetaylar] = useState<Record<number, TfHammaddeRecete[]>>({});
  const [maliyetler, setMaliyetler] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ReceteApi.list()
      .then(data => setReceteler(data || []))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    if (receteler.length > 0) {
      const promises = receteler.map(recete =>
        ReceteHammaddeApi.list(recete.id)
          .then(detay => ({
            id: recete.id,
            detay: detay || [],
            toplam: (detay || []).reduce(
              (s, r) => s + (r.kullanimGram / 1000) * r.hammadde.kiloFiyat,
              0
            )
          }))
          .catch(() => ({ id: recete.id, detay: [], toplam: 0 }))
      );
      Promise.all(promises).then(results => {
        const newDetaylar: Record<number, TfHammaddeRecete[]> = {};
        const newMaliyetler: Record<number, number> = {};
        results.forEach(({ id, detay, toplam }) => {
          newDetaylar[id] = detay;
          newMaliyetler[id] = toplam;
        });
        setDetaylar(newDetaylar);
        setMaliyetler(newMaliyetler);
      });
    }
  }, [receteler]);

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-800">Reçete Maliyetleri</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {receteler.map(recete => (
          <div key={recete.id} className="bg-white border border-orange-200 rounded-lg shadow-sm flex flex-col">
            <div className="p-3 bg-orange-100 border-b rounded-t-lg border-orange-200">
              <h2 className="text-base font-semibold text-orange-800">{recete.urunAdi}</h2>
            </div>
            <div className="p-3 flex flex-col flex-grow">
              <ul className="space-y-1 flex-grow">
                {detaylar[recete.id]?.map(d => (
                  <li key={d.id} className="bg-orange-50 border border-orange-100 rounded p-1.5 text-xs grid grid-cols-3 gap-1 items-center">
                    <span className="font-medium text-orange-800 truncate">{d.hammadde.hammaddeAdi}</span>
                    <span className="text-orange-700 text-center">{d.kullanimGram}g</span>
                    <span className="text-orange-600 font-semibold text-right">{(d.kullanimGram / 1000 * d.hammadde.kiloFiyat).toFixed(2)} ₺</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg font-bold text-orange-700 mt-2 border-t border-orange-100 pt-1 text-right">
                Toplam: {maliyetler[recete.id]?.toFixed(2) || "0.00"} ₺
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {receteler.length === 0 && (
        <div className="bg-white border border-orange-200 rounded-lg shadow-sm p-8 text-center">
          <div className="text-orange-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-orange-800 mb-2">Reçete Bulunmuyor</h3>
          <p className="text-orange-600">Henüz hiç reçete oluşturmadınız. Reçete yönetimi sayfasından yeni reçete ekleyebilirsiniz.</p>
        </div>
      )}
    </div>
  );
}