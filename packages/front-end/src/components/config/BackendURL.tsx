import { Button, Input, Message } from "@arco-design/web-react";
import FormItem from "@arco-design/web-react/es/Form/form-item";
import parseUrl from "parse-url";
import { EditInPlace } from "./EditInPlace";
import { useConfig } from "../../hooks";
import { IconCheck } from "@arco-design/web-react/icon";
import { useState } from "react";
import { isString } from "lodash";

export const BackendURL = () => {
  const { config, updateConfigByKey, httpHelper } = useConfig();
  const [value, setValue] = useState(config.backendURL);
  const [loading, setLoading] = useState(false);

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const Default = () => {
    return <span>{config.backendURL}</span>;
  };

  const Edit = () => {
    return <Input value={value} onChange={handleValueChange} />;
  };

  const confirmButton = (resolve: () => void) => {
    const handleClick = async () => {
      setLoading(true);
      const newConfig = updateConfigByKey("backendURL", value);
      try {
        if (config.enableSync) {
          await httpHelper.updateConfig(newConfig);
        }
        resolve();
      } catch (error) {
        if (isString(error)) Message.error(error);
        else Message.error("接口异常");
      } finally {
        setLoading(false);
      }
    };

    return (
      <Button
        onClick={handleClick}
        loading={loading}
        type="text"
        icon={<IconCheck />}
      ></Button>
    );
  };

  return (
    <FormItem
      label="服务器地址"
      field="backendURL"
      rules={[
        {
          validator(value, callback) {
            if (value === "") return callback();
            try {
              parseUrl(value);
              return callback();
            } catch (error) {
              return callback("网址不合法");
            }
          },
        },
      ]}
    >
      <EditInPlace
        renderDefault={Default}
        renderEdit={Edit}
        renderConfirmButton={confirmButton}
      />
    </FormItem>
  );
};
