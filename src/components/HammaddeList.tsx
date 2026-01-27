import { TfHammadde } from "../types/models";

interface Props {
  list: TfHammadde[];
  onEdit?: (hammadde: TfHammadde) => void;
}

export default function HammaddeList({ list, onEdit }: Props) {
  return (
    <ul className="divide-y divide-orange-50">
      {list.map(h => (
        <li key={h.id} className="flex justify-between items-center p-3 hover:bg-orange-25">
          <span className="text-orange-800 font-medium">{h.hammaddeAdi}</span>
          <div className="flex items-center gap-4">
            <span className="text-orange-600 font-semibold">{h.kiloFiyat} ₺ / kg</span>
            {onEdit && (
              <button
                onClick={() => onEdit(h)}
                className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
              >
                Düzenle
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}