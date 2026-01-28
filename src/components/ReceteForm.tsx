import { useState, useEffect } from "react";
import { ReceteApi } from "../services/receteApi";
import { TfRecete } from "../types/models";

interface Props {
  onSuccess?: () => void;
  editing?: TfRecete;
  onCancel?: () => void;
}

export default function ReceteForm({ onSuccess, editing, onCancel }: Props) {
  const [form, setForm] = useState<Partial<TfRecete>>({});
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
    
    ReceteApi.kayit(submitData)
      .then(() => {
        setSuccess(true);
        if (!editing) {
          setForm({});
        }
        onSuccess?.();
        onCancel?.();
      })
      .catch(err => setError(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{editing ? 'Güncellendi!' : 'Kaydedildi!'}</div>}
      <input
        type="text"
        placeholder="Ürün Adı"
        value={form.urunAdi || ""}
        onChange={e => setForm({ ...form, urunAdi: e.target.value })}
        className="border border-orange-100 p-2 w-full rounded focus:border-orange-200"
        required
      />
      <input
        type="number"
        placeholder="Oluşan Birim"
        value={form.olusanBirim || ""}
        onChange={e => setForm({ ...form, olusanBirim: Number(e.target.value) })}
        className="border border-orange-100 p-2 w-full rounded focus:border-orange-200"
        required
      />
      <div className="flex gap-2">
        <button type="submit" className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded">
          {editing ? 'Güncelle' : 'Kaydet'}
        </button>
        {editing && onCancel && (
          <button type="button" onClick={onCancel} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
            İptal
          </button>
        )}
      </div>
    </form>
  );
}