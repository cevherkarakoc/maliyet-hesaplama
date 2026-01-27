export interface TfHammadde {
  id: number;
  hammaddeAdi: string;
  kiloFiyat: number;
  aktifPasif: "A" | "P";
}

export interface TfRecete {
  id: number;
  urunAdi: string;
  aktifPasif: "A" | "P";
}

export interface TfHammaddeRecete {
  id: number;
  kullanimGram: number;
  hammadde: TfHammadde;
  recete: TfRecete;
}