import { nanoid } from "nanoid";

export const saveBlob = (key: BlobKeys, blob: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const id = nanoid();
    reader.onload = (event) => {
      chrome.storage.local
        .set({ [`${key}-${id}`]: event?.target?.result })
        .then(() => resolve(`${key}-${id}`));
    };

    reader.readAsDataURL(blob);
  });
};
export const loadBlob = async (key: string) => {
  return (await chrome.storage.local.get([key]))[key];
};
