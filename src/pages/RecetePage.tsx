import { useEffect, useState } from "react";
import { ReceteApi } from "../services/receteApi";
import { ReceteHammaddeApi } from "../services/receteHammaddeApi";
import { TfRecete, TfHammaddeRecete } from "../types/models";
import ReceteForm from "../components/ReceteForm";
import ReceteHammaddeForm from "../components/ReceteHammaddeForm";
import ReceteDetayTable from "../components/ReceteDetayTable";

export default function RecetePage() {
  const [list, setList] = useState<TfRecete[]>([]);
  const [selectedRecete, setSelectedRecete] = useState<TfRecete | null>(null);
  const [detay, setDetay] = useState<TfHammaddeRecete[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    hammaddeReceteId: number | null;
    hammaddeAdi: string;
  }>({ open: false, hammaddeReceteId: null, hammaddeAdi: '' });
  const [editingRecete, setEditingRecete] = useState<TfRecete | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const loadList = () => {
    ReceteApi.list()
      .then(data => setList(data || []))
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    loadList();
  }, []);

  const loadDetay = (receteId: number) => {
    ReceteHammaddeApi.list(receteId)
      .then(data => setDetay(data || []))
      .catch(err => setError(err.message));
  };

  const handleReceteSelect = (recete: TfRecete) => {
    setSelectedRecete(recete);
    setEditingRecete(null); // Düzenleme modundan çık
    loadDetay(recete.id);
  };

  const handleEditRecete = (recete: TfRecete) => {
    setEditingRecete(recete);
  };

  const handleCancelEdit = () => {
    setEditingRecete(null);
  };

  const handleDeleteHammadde = (hammaddeReceteId: number) => {
    const hammadde = detay.find(d => d.id === hammaddeReceteId);
    if (hammadde) {
      setDeleteDialog({
        open: true,
        hammaddeReceteId,
        hammaddeAdi: hammadde?.hammadde?.hammaddeAdi
      });
    }
  };

  const confirmDelete = () => {
    if (deleteDialog.hammaddeReceteId) {
      ReceteHammaddeApi.sil(deleteDialog.hammaddeReceteId)
        .then(() => {
          if (selectedRecete) {
            loadDetay(selectedRecete.id);
          }
          setDeleteDialog({ open: false, hammaddeReceteId: null, hammaddeAdi: '' });
        })
        .catch(err => setError(err.message));
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ open: false, hammaddeReceteId: null, hammaddeAdi: '' });
  };

  const filteredList = list.filter(r => 
    r.urunAdi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="text-red-500">Hata: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-orange-800">Reçete Yönetimi</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel: Form + Reçete Listesi */}
        <div className="lg:col-span-1 space-y-4">
          {/* Reçete Ekleme Formu */}
          <div className="bg-white border border-orange-200 rounded-lg shadow-sm">
            <div className="p-4 bg-orange-100 border-b rounded-t-lg border-orange-200">
              <h2 className="text-lg font-semibold text-orange-800">Yeni Reçete</h2>
            </div>
            <div className="p-4">
              <ReceteForm onSuccess={loadList} />
            </div>
          </div>

          {/* Reçete Listesi */}
          <div className="bg-white border border-orange-200 rounded-lg shadow-sm">
            <div className="p-4 bg-orange-100 border-b rounded-t-lg border-orange-200">
              <h2 className="text-lg font-semibold text-orange-800">Reçeteler</h2>
            </div>
            <div className="p-4 border-b border-orange-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Reçete ara..."
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
              <ul className="divide-y divide-orange-50">
                {filteredList.map(r => (
                  <li
                    key={r.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      selectedRecete?.id === r.id 
                        ? 'bg-orange-200 font-semibold' 
                        : 'hover:bg-orange-25'
                    }`}
                    onClick={() => handleReceteSelect(r)}
                  >
                    <div className="text-orange-800 font-medium">{r.urunAdi}</div>
                    <div className="text-xs text-orange-600 mt-1">Birim: {(r.olusanBirim || 0).toString().replace('.', ',')}</div>
                  </li>
                ))}
              </ul>
              {filteredList.length === 0 && list.length > 0 && (
                <div className="p-4 text-center text-orange-500">
                  Arama sonucu bulunamadı
                </div>
              )}
              {list.length === 0 && (
                <div className="p-4 text-center text-orange-500">
                  Henüz reçete bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reçete Detayları */}
        <div className="lg:col-span-2">
          {selectedRecete ? (
            <div className="bg-white border border-orange-200 rounded-lg shadow-sm">
              <div className="p-4 bg-orange-100 border-b rounded-t-lg border-orange-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-orange-800">
                  {editingRecete ? 'Reçete Düzenle' : `${selectedRecete.urunAdi} Detayları`}
                </h2>
                {!editingRecete && (
                  <button
                    onClick={() => handleEditRecete(selectedRecete)}
                    className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Adı Düzenle
                  </button>
                )}
              </div>
              <div className="p-4 space-y-4">
                {editingRecete ? (
                  <ReceteForm 
                    editing={editingRecete} 
                    onSuccess={() => {
                      loadList();
                      setEditingRecete(null);
                      if (selectedRecete) {
                        loadDetay(selectedRecete.id);
                      }
                    }} 
                    onCancel={handleCancelEdit}
                  />
                ) : (
                  <>
                    <ReceteHammaddeForm receteId={selectedRecete.id} onSuccess={() => loadDetay(selectedRecete.id)} />
                    <ReceteDetayTable detay={detay} onDelete={handleDeleteHammadde} olusanBirim={selectedRecete.olusanBirim} />
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-orange-200 rounded-lg shadow-sm p-8 text-center">
              <div className="text-orange-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-orange-800 mb-2">Reçete Seçin</h3>
              <p className="text-orange-600">Sol taraftan bir reçete seçerek detaylarını görüntüleyin ve düzenleyin.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-orange-800 mb-4">Hammaddiyi Sil</h3>
            <p className="text-orange-700 mb-6">
              <strong>{deleteDialog.hammaddeAdi}</strong> hammaddesini bu tariften silmek istediğinizden emin misiniz?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}