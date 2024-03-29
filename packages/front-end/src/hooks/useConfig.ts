import { useContext, useEffect, useRef, useState } from "react";
import { useConfigState } from "../store/useConfigState";
import { HttpHelper } from "../utils";
import { useSavingState } from "../store/useSavingState";
import { pick } from "lodash";

export type UseConfigReturnType = {
  config: Config;
  updateConfigByKey: <T extends keyof Config>(
    key: T,
    value: Config[T]
  ) => Config;
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
  const configRef = useRef<Config>(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const updateConfigByKey = <T extends keyof Config>(
    key: T,
    value: Config[T]
  ) => {
    setIsSavingLocal(true);

    const newConfig: Config = {
      ...configRef.current,
      [key]: value,
    };

    setConfig(newConfig).then(() => setIsSavingLocal(false));

    return newConfig;
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
