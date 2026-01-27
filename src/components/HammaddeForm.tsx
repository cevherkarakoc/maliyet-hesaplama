import { useState, useEffect } from "react";
import { HammaddeApi } from "../services/hammaddeApi";
import { TfHammadde } from "../types/models";

interface Props {
  onSuccess?: () => void;
  editing?: TfHammadde;
  onCancel?: () => void;
}

export default function HammaddeForm({ onSuccess, editing, onCancel }: Props) {
  const [form, setForm] = useState<Partial<TfHammadde>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm(editing);
    } else {
      setForm({});
    }
  }, [editing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    const submitData = editing ? { ...form, id: editing.id, aktifPasif: "A" } : form;
    
    HammaddeApi.kayit(submitData)
      .then(() => {
        setSuccess(true);
        setForm({});
        onSuccess?.();
        onCancel?.();
      })
      .catch(err => setError(err.message));
  };

  const handleCancel = () => {
    setForm({});
    setError(null);
    setSuccess(false);
    onCancel?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{editing ? 'Güncellendi!' : 'Kaydedildi!'}</div>}
      <input
        type="text"
        placeholder="Hammadde Adı"
        value={form.hammaddeAdi || ""}
        onChange={e => setForm({ ...form, hammaddeAdi: e.target.value })}
        className="border border-orange-100 p-2 w-full rounded focus:border-orange-200"
        required
      />
      <input
        type="number"
        placeholder="Kilo Fiyat"
        value={form.kiloFiyat || ""}
        onChange={e => setForm({ ...form, kiloFiyat: Number(e.target.value) })}
        className="border border-orange-100 p-2 w-full rounded focus:border-orange-200"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded">
          {editing ? 'Güncelle' : 'Kaydet'}
        </button>
        {editing && (
          <button type="button" onClick={handleCancel} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
            İptal
          </button>
        )}
      </div>
    </form>
  );
}