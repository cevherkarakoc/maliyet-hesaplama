import { post } from "./http";
import { TfHammadde } from "../types/models";

export const HammaddeApi = {
  list: () => post<TfHammadde[]>("/hammadde/list"),
  kayit: (data: Partial<TfHammadde>) => post("/hammadde/kayit", data),
};