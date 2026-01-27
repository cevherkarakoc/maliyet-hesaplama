import { useEffect, useState } from "react";
import { ReceteApi } from "../services/receteApi";
import { TfRecete } from "../types/models";

interface Props {
  onChange: (id: number) => void;
}

export default function ReceteSelect({ onChange }: Props) {
  const [list, setList] = useState<TfRecete[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ReceteApi.list()
      .then(data => setList(data || []))
      .catch(err => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <select
      className="border border-orange-100 p-2 rounded bg-white text-orange-700 focus:border-orange-200"
      onChange={e => onChange(Number(e.target.value))}
    >
      <option>Reçete seç</option>
      {list.map(r => (
        <option key={r.id} value={r.id}>{r.urunAdi}</option>
      ))}
    </select>
  );
}