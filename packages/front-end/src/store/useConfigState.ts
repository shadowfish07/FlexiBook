import { nanoid } from "nanoid";
import create from "zustand";

interface ConfigState {
  config: Config;
  setConfig: (config: Config) => Promise<void>;
  loadLocalConfig: () => Promise<Config>;
}

const INIT_CONFIG: Config = {
  defaultCategory: {
    title: "所有书签",
    icon: "🗂️",
  },
  favorite: {
    title: "星标",
    icon: "❤️",
  },
  clientId: nanoid(),
  clientSecret: nanoid(),
  enableSync: false,
};

const loadLocalConfig = async () => {
  let jsonConfig = (await chrome.storage.local.get(["config"])).config;
  console.log("loaded config", jsonConfig);
  if (!jsonConfig || Object.keys(jsonConfig).length === 0) {
    console.log("init config", INIT_CONFIG);
    writeLocalConfig(INIT_CONFIG);
    return INIT_CONFIG;
  }

  return jsonConfig;
};

const writeLocalConfig = async (config: Config) => {
  console.log("writeLocalConfig", config);
  await chrome.storage.local.set({ config });
};

export const useConfigState = create<ConfigState>((set) => ({
  config: INIT_CONFIG,
  setConfig: async (config: Config) => {
    set({ config });
    await writeLocalConfig(config);
  },
  loadLocalConfig: async () => {
    const config = await loadLocalConfig();
    set({ config });
    return config;
  },
}));
