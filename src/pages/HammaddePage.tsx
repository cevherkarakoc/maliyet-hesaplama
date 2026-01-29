import { useEffect, useState } from "react";
import { HammaddeApi } from "../services/hammaddeApi";
import { TfHammadde } from "../types/models";
import HammaddeForm from "../components/HammaddeForm";
import HammaddeList from "../components/HammaddeList";

export default function HammaddePage() {
  const [list, setList] = useState<TfHammadde[]>([]);
  const [editing, setEditing] = useState<TfHammadde | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadList = () => {
    HammaddeApi.list()
      .then(data => setList(data || []))
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    loadList();
  }, []);

  const handleEdit = (hammadde: TfHammadde) => {
    setEditing(hammadde);
  };

  const handleCancelEdit = () => {
    setEditing(undefined);
  };

  const filteredList = list.filter(h => 
    h.hammaddeAdi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-800">Hammadde Yönetimi</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sol Panel: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-orange-200 rounded-lg shadow-sm">
            <div className="p-4 bg-orange-100 border-b rounded-t-lg border-orange-200">
              <h2 className="text-lg font-semibold text-orange-800">
                {editing ? 'Hammaddiyi Düzenle' : 'Yeni Hammadde'}
              </h2>
            </div>
            <div className="p-4">
              <HammaddeForm 
                onSuccess={loadList} 
                editing={editing} 
                onCancel={handleCancelEdit} 
              />
            </div>
          </div>
        </div>

        {/* Sağ Panel: Liste */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-orange-200 rounded-lg shadow-sm">
            <div className="p-4 bg-orange-100 border-b rounded-t-lg border-orange-200">
              <h2 className="text-lg font-semibold text-orange-800">Hammaddeler</h2>
            </div>
            <div className="p-4 border-b border-orange-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hammadde ara..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="border border-orange-100 p-2 w-full rounded bg-white text-orange-700 focus:border-orange-200 pr-10"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-orange-400 hover:text-orange-600 p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <HammaddeList list={filteredList} onEdit={handleEdit} />
              {filteredList.length === 0 && list.length > 0 && (
                <div className="p-4 text-center text-orange-500">
                  Arama sonucu bulunamadı
                </div>
              )}
              {list.length === 0 && (
                <div className="p-4 text-center text-orange-500">
                  Henüz hammadde bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}