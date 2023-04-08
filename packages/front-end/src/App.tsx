import { useEffect, useLayoutEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { WebApp } from "./pages";
import { useConfigState } from "./store/useConfigState";
import { useDataState } from "./store/useDataState";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Extension } from "./pages/Extension";
import { useIncrementalUpdateState } from "./store/useIncrementalUpdateState";

function App() {
  const [loading, setLoading] = useState(true);

  const loadLocalConfig = useConfigState((state) => state.loadLocalConfig);
  const loadLocalData = useDataState((state) => state.loadLocalData);
  const loadLocalIncrementalData = useIncrementalUpdateState(
    (state) => state.loadFromLocal
  );

  useEffect(() => {
    const loadPromises = [
      loadLocalConfig(),
      loadLocalData(),
      loadLocalIncrementalData(),
    ];
    Promise.all(loadPromises).then(() => {
      setLoading(false);
    });
  }, []);

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
