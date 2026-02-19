import { useApp } from "@modelcontextprotocol/ext-apps/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { useTranslation } from "react-i18next";
// import { ErrorScreen } from "./components/ErrorScreen.tsx";
import { LoadingScreen } from "./components/LoadingScreen.tsx";
import { MainView } from "./components/MainView.tsx";
import "./i18n.ts";
import "./index.css";

/**
 * Main Application component for the 3D-Render MCP App.
 * Handles state management, MCP app initialization, and UI layout.
 */
function App() {
  const { t } = useTranslation('common');
  const [elements, setElements] = useState<any[]>([]);
  const [checkpointId, setCheckpointId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [agentInfo, setAgentInfo] = useState({ name: '🤖 @DaVinci', label: '3D Scene' });
  const [autoRotateEnabled, setAutoRotateEnabled] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<any>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  /**
   * Returns agent name and label based on the tool being executed.
   */
  const getAgentInfo = (toolName: string) => {
    let name = '🤖 @Sarki';
    let label = toolName;

    switch (toolName.toLocaleLowerCase()) {
      case '3d_render_scene':
        name = '🤖 @DaVinci';
        label = '3D Scene';
        break;
      case 'read_checkpoint':
      case 'save_checkpoint':
        name = '🤖 @Picasso';
        label = toolName === 'read_checkpoint' ? 'Lecture' : 'Sauvegarde';
        break;
    }
    return { name, label };
  };

  const { app } = useApp({
    appInfo: { name: "3D-Render", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      const restoreCheckpoint = async (elementsStr: string) => {
        try {
          const parsed = JSON.parse(elementsStr);
          const restoreEl = parsed.find((el: any) => el.type === "restoreCheckpoint");
          if (restoreEl?.id) {
            // @ts-ignore - callTool is usually available via bridge
            const result = await app.callTool("3d_read_checkpoint", { id: restoreEl.id });
            const content = (result as any)?.content?.[0]?.text;
            if (content) {
              const baseData = JSON.parse(content);
              if (baseData?.elements) {
                setElements(baseData.elements);
              }
            }
          }
        } catch (e) {
          console.warn("[3D-Render] Failed to auto-restore checkpoint:", e);
        }
      };

      app.ontoolinput = (input) => {
        setLoading(true);

        const toolName = (input as any).name || (input as any).toolName;
        if (toolName) {
          setAgentInfo(getAgentInfo(toolName));
        }

        const elementsStr = (input.arguments as any)?.elements;
        if (elementsStr) {
          restoreCheckpoint(elementsStr);
        }
      };

      app.ontoolresult = (result) => {
        setLoading(false);

        const data = (result as any)?.structuredContent;
        if (data?.elements) {
          setElements(data.elements);
        }
        if (data?.checkpointId) {
          setCheckpointId(data.checkpointId);
        }
        if (data?.camera) {
          setCameraTarget(data.camera);
        }
      };
    },
  });

  // if (error) return <ErrorScreen message={error.message} theme={theme} onRetry={() => window.location.reload()} />;
  if (!app) return <LoadingScreen theme={theme} label={t('initialization')} />;

  return (
    <MainView
      theme={theme}
      setTheme={setTheme}
      agentInfo={agentInfo}
      checkpointId={checkpointId}
      loading={loading}
      elements={elements}
      autoRotateEnabled={autoRotateEnabled}
      setAutoRotateEnabled={setAutoRotateEnabled}
      cameraTarget={cameraTarget}
    />
  );
}


const root = createRoot(document.getElementById("root")!);
root.render(<App />);
