import { useEffect, useLayoutEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { SavingContext } from "./main";
import { WebApp } from "./pages";
import { useConfigState } from "./store/useConfigState";
import { useDataState } from "./store/useDataState";
import { HTML5Backend } from "react-dnd-html5-backend";

function App() {
  const openNewPage = () => {
    chrome.tabs.create({
      url: "index.html?aa=1",
    });
  };

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadLocalConfig = useConfigState((state) => state.loadLocalConfig);
  const loadLocalData = useDataState((state) => state.loadLocalData);

  useEffect(() => {
    const loadPromises = [loadLocalConfig(), loadLocalData()];
    Promise.all(loadPromises).then(() => {
      setLoading(false);
    });
  }, []);

  useLayoutEffect(() => {
    document.body.setAttribute("arco-theme", "dark");
  }, []);

  // TODO 传入App，内部支持骨架屏渲染
  if (loading) return <div>Loading...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <SavingContext.Provider value={{ isSaving, setIsSaving }}>
        <WebApp />
      </SavingContext.Provider>
    </DndProvider>
  );
}

export default App;
