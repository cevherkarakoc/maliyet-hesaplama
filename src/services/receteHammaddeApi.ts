import { post } from "./http";
import { TfHammaddeRecete } from "../types/models";

export const ReceteHammaddeApi = {
  list: (receteId: number) =>
    post<TfHammaddeRecete[]>("/hammadde-recete/list", undefined, { receteId }),
  kayit: (data: Partial<TfHammaddeRecete>) => post("/hammadde-recete/kayit", data),
  sil: (hammaddeReceteId: number) => post("/hammadde-recete/sil", null, { hammaddeReceteId }),
};