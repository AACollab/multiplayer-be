import axios from "axios";

const GET_API_HEADERS = {
  "Content-Type": "application/json",
};

const POST_API_DEFAULT_OPTIONS = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const DEFAULT_GET_PARAMS = {
  page: 1,
  offset: 10,
  sort: "asc",
  apikey: process.env.XDC_SCAN_API_KEY,
};

export const getData = async <T>(params?: {}) =>
  (
    await axios.get(process.env.XDC_SCAN_URL ?? "", {
      params: { ...params, ...DEFAULT_GET_PARAMS },
      headers: GET_API_HEADERS,
    })
  ).data as T;

export const postData = async <T>(
  url: string,
  data: unknown,
  { ...POST_API_DEFAULT_OPTIONS }
) => (await fetch(url)).json() as T;
