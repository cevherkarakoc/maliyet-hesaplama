import { post } from "./http";
import { TfRecete } from "../types/models";

export const ReceteApi = {
  list: () => post<TfRecete[]>("/recete/list"),
  kayit: (data: Partial<TfRecete>) => post("/recete/kayit", data),
};