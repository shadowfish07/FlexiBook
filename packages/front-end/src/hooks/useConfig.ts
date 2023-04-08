import { useContext, useState } from "react";
import { useConfigState } from "../store/useConfigState";
import { HttpHelper } from "../utils";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";

export type UseConfigReturnType = {
  config: Config;
  updateConfigByKey: <T extends keyof Config>(key: T, value: Config[T]) => void;
  updateConfig: (newConfig: Config) => void;
  httpHelper: HttpHelper;
};

export const useConfig = (): UseConfigReturnType => {
  const [config, setConfig] = useConfigState((state) => [
    state.config,
    state.setConfig,
  ]);
  const { setIsSavingLocal } = useSavingState((state) =>
    pick(state, ["setIsSavingLocal"])
  );

  const updateConfigByKey = <T extends keyof Config>(
    key: T,
    value: Config[T]
  ) => {
    setIsSavingLocal(true);

    const newConfig: Config = {
      ...config,
      [key]: value,
    };

    setConfig(newConfig).then(() => setIsSavingLocal(false));
  };

  const updateConfig = (newConfig: Config) => {
    setIsSavingLocal(true);

    setConfig(newConfig).then(() => setIsSavingLocal(false));
  };

  return {
    config,
    updateConfigByKey,
    updateConfig,
    httpHelper: new HttpHelper(config),
  };
};
