import { Badge, Button, Message, Switch } from "@arco-design/web-react";
import { useConfig } from "../../hooks";
import { useIncrementalUpdateState } from "../../store/useIncrementalUpdateState";
import { useCallback, useMemo, useState } from "react";
import { isString } from "lodash";
import FormItem from "@arco-design/web-react/es/Form/form-item";

export const Sync = () => {
  const { config, updateConfigByKey, httpHelper } = useConfig();
  const { incrementalUpdateSerialNumber, setIncrementalUpdateSerialNumber } =
    useIncrementalUpdateState();
  const [loading, setLoading] = useState(false);

  const BackendURLNotSet = () => {
    return <Badge status="error" text="配置后端服务后可用"></Badge>;
  };

  const handleInitSync = async () => {
    setLoading(true);
    try {
      const newConfig = updateConfigByKey("enableSync", true);
      await httpHelper.initSync(newConfig);
      setIncrementalUpdateSerialNumber(1);
    } catch (error) {
      if (isString(error)) Message.error(error);
      else Message.error("接口异常");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSync = async (checked: boolean) => {
    const newConfig = updateConfigByKey("enableSync", checked);
    setLoading(true);
    try {
      await httpHelper.updateConfig(newConfig);
    } catch (error) {
      if (isString(error)) Message.error(error);
      else Message.error("接口异常");
    } finally {
      setLoading(false);
    }
  };

  const BackendURLSet = useCallback(() => {
    return incrementalUpdateSerialNumber === 0 ? (
      <Button loading={loading} onClick={handleInitSync}>
        初始化服务器同步能力
      </Button>
    ) : (
      <Switch
        loading={loading}
        onChange={handleToggleSync}
        checkedText="开启"
        uncheckedText="关闭"
        checked={config.enableSync}
      />
    );
  }, [incrementalUpdateSerialNumber, loading, config.enableSync]);

  return (
    <FormItem label="服务器同步">
      {config.backendURL ? <BackendURLSet /> : <BackendURLNotSet />}
    </FormItem>
  );
};
