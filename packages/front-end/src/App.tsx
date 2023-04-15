import { useEffect, useLayoutEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { WebApp } from "./pages";
import { useConfigState } from "./store/useConfigState";
import { useDataState } from "./store/useDataState";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Extension } from "./pages/Extension";
import { useIncrementalUpdateState } from "./store/useIncrementalUpdateState";
import { useOauthState } from "./store/useOauthState";
import { HttpHelper } from "./utils";

function App() {
  const [loading, setLoading] = useState(true);

  const { loadLocalConfig, config } = useConfigState((state) => ({
    loadLocalConfig: state.loadLocalConfig,
    config: state.config,
  }));
  const loadLocalData = useDataState((state) => state.loadLocalData);
  const loadLocalIncrementalData = useIncrementalUpdateState(
    (state) => state.loadFromLocal
  );
  const { loadLocalOauthData, loadRemoteOauthData } = useOauthState(
    (state) => ({
      loadLocalOauthData: state.loadLocalData,
      loadRemoteOauthData: state.loadRemoteData,
    })
  );

  useEffect(() => {
    const loadPromises = [
      loadLocalConfig(),
      loadLocalData(),
      loadLocalIncrementalData(),
      loadLocalOauthData(),
    ];
    Promise.all(loadPromises).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (config.backendURL) {
      loadRemoteOauthData(new HttpHelper(config));
    }
  }, [config.backendURL]);

  useLayoutEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
  }, []);

  // TODO 传入App，内部支持骨架屏渲染
  if (loading) return <div>Loading...</div>;

  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");

  return (
    <DndProvider backend={HTML5Backend}>
      {page === "dashboard" ? <WebApp /> : <Extension />}
    </DndProvider>
  );
}

export default App;
