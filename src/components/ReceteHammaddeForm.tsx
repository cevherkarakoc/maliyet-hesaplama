import { useEffect, useState } from "react";
import { HammaddeApi } from "../services/hammaddeApi";
import { ReceteHammaddeApi } from "../services/receteHammaddeApi";
import { TfHammadde, TfHammaddeRecete } from "../types/models";

interface Props {
  receteId: number;
  onSuccess?: () => void;
}

export default function ReceteHammaddeForm({ receteId, onSuccess }: Props) {
  const [hammaddeler, setHammaddeler] = useState<TfHammadde[]>([]);
  const [form, setForm] = useState<Partial<TfHammaddeRecete>>({ recete: { id: receteId } });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    HammaddeApi.list()
      .then(data => setHammaddeler(data || []))
      .catch(err => setError(err.message));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    ReceteHammaddeApi.kayit(form)
      .then(() => {
        setSuccess(true);
        setForm({ recete: { id: receteId } });
        onSuccess?.();
      })
      .catch(err => setError(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <h3 className="font-bold">Hammadde Ekle</h3>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Eklendi!</div>}
      <select
        value={form.hammadde?.id || ""}
        onChange={e => setForm({ ...form, hammadde: { id: Number(e.target.value) } })}
        className="border border-orange-100 p-2 w-full rounded bg-white text-orange-700 focus:border-orange-200"
        required
      >
        <option value="" disabled>Hammadde seç</option>
        {hammaddeler.map(h => (
          <option key={h.id} value={h.id}>{h.hammaddeAdi}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Kullanım Gram"
        value={form.kullanimGram || ""}
        onChange={e => setForm({ ...form, kullanimGram: Number(e.target.value) })}
        className="border border-orange-100 p-2 w-full rounded focus:border-orange-200"
        required
      />
      <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded">
        Ekle
      </button>
    </form>
  );
}