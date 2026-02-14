import { CorsOptions } from "cors";

export const corsOptions: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    callback(null, true);
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
