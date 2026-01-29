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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    HammaddeApi.list()
      .then(data => setHammaddeler(data || []))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    setForm({ recete: { id: receteId } });
    setSearchTerm("");
  }, [receteId]);

  const filteredHammaddeler = hammaddeler.filter(h => 
    h.hammaddeAdi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedHammadde = hammaddeler.find(h => h.id === form.hammadde?.id);

  const handleSelectHammadde = (hammadde: TfHammadde) => {
    setForm({ ...form, hammadde: { id: hammadde.id } });
    setSearchTerm(hammadde.hammaddeAdi);
    setIsDropdownOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    ReceteHammaddeApi.kayit(form)
      .then(() => {
        setSuccess(true);
        setForm({ recete: { id: receteId } });
        setSearchTerm("");
        onSuccess?.();
      })
      .catch(err => setError(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
      <h3 className="font-bold">Hammadde Ekle</h3>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Eklendi!</div>}
      <div className="relative">
        <input
          type="text"
          placeholder="Hammadde seç"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="border border-orange-100 p-2 w-full rounded bg-white text-orange-700 focus:border-orange-200 pr-10"
          required={!form.hammadde?.id}
          autoComplete="off"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setForm({ ...form, hammadde: undefined });
              setIsDropdownOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {isDropdownOpen && filteredHammaddeler.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-orange-200 rounded shadow-lg max-h-60 overflow-y-auto">
            {filteredHammaddeler.map(h => (
              <div
                key={h.id}
                onClick={() => handleSelectHammadde(h)}
                className="p-2 hover:bg-orange-50 cursor-pointer text-orange-700 border-b border-orange-50 last:border-b-0"
              >
                {h.hammaddeAdi}
              </div>
            ))}
          </div>
        )}
        {isDropdownOpen && searchTerm && filteredHammaddeler.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-orange-200 rounded shadow-lg p-2 text-orange-500 text-sm">
            Sonuç bulunamadı
          </div>
        )}
      </div>
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