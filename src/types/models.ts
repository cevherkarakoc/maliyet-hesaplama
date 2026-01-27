export interface TfHammadde {
  id: number;
  hammaddeAdi: string;
  kiloFiyat: number;
  aktifPasif: string;
}

export interface TfRecete {
  id: number;
  urunAdi: string;
  aktifPasif: string;
}

export interface TfHammaddeRecete {
  id: number;
  kullanimGram: number;
  hammadde: TfHammadde;
  recete: TfRecete;
}