import { nanoid } from "nanoid";

const BLOB_KEY = "iconBlob";

export const saveBlob = (key: BlobKeys, blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const id = nanoid();
    reader.onload = (event) => {
      chrome.storage.local
        .set({ [key]: { [`${id}`]: event?.target?.result } })
        .then(() => resolve(`${id}`));
    };

    reader.readAsDataURL(blob);
  });
};
export const loadIconBlob = async (key: string) => {
  return (await chrome.storage.local.get(BLOB_KEY))[BLOB_KEY][key];
};
