import { cloneDeep } from "lodash";

export const SERVER_URL = process.env.SERVER_URL;
export const HOST_URL = process.env.HOST_URL;

const meta = {
  title: "Life care 24h",
  description: "The descriptions.",
};

export default function getMetadata(title?: string) {
  const data = cloneDeep(meta);
  if (title) {
    data.title = meta.title + " | " + title;
  }
  return data;
}
