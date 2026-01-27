import { TfHammaddeRecete } from "../types/models";

interface Props {
  detay: TfHammaddeRecete[];
  onDelete?: (hammaddeReceteId: number) => void;
}

export default function ReceteDetayTable({ detay, onDelete }: Props) {
  return (
    <table className="w-full border border-orange-100 bg-white rounded">
      <thead className="bg-orange-50">
        <tr>
          <th className="border border-orange-100 p-2 text-orange-700">Hammadde</th>
          <th className="border border-orange-100 p-2 text-orange-700">Gram</th>
          <th className="border border-orange-100 p-2 text-orange-700">Tutar</th>
          {onDelete && <th className="border border-orange-100 p-2 text-orange-700">İşlemler</th>}
        </tr>
      </thead>
      <tbody>
        {detay.map(d => (
          <tr key={d.id} className="hover:bg-orange-25">
            <td className="border border-orange-100 p-2 text-orange-700">{d.hammadde.hammaddeAdi}</td>
            <td className="border border-orange-100 p-2 text-orange-600">{d.kullanimGram}</td>
            <td className="border border-orange-100 p-2 text-orange-500 font-semibold">
              {((d.kullanimGram / 1000) * d.hammadde.kiloFiyat).toFixed(2)} ₺
            </td>
            {onDelete && (
              <td className="border border-orange-100 p-2 text-center">
                <button
                  onClick={() => onDelete(d.id)}
                  className="bg-red-400 hover:bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Sil
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}