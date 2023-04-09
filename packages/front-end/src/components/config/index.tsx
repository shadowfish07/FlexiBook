import {
  Button,
  Collapse,
  Drawer,
  Form,
  Input,
  Message,
  Modal,
  ResizeBox,
  Switch,
} from "@arco-design/web-react";
import FormItem from "@arco-design/web-react/es/Form/form-item";
import parseUrl from "parse-url";
import { useEffect, useRef, useState } from "react";
import { useConfig } from "../../hooks";
import { Sync } from "./Sync";
import { BackendURL } from "./BackendURL";
import { createGlobalStyle } from "styled-components";

type Props = {
  renderButton: (openDrawer: () => void) => JSX.Element;
};

const GlobalClass = createGlobalStyle`
  .config-collapse .arco-row:last-child {
    margin-bottom: 0;
  }
`;

export const Config = ({ renderButton }: Props) => {
  const [visible, setVisible] = useState(false);
  const { config, updateConfig } = useConfig();
  const formRef = useRef<any>();
  const [isChanged, setIsChanged] = useState(false);

  const openDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
    setIsChanged(false);
  };

  const handleSubmit = (values: Config) => {
    updateConfig({
      ...config,
      ...values,
    });
    hideDrawer();
    Message.success("设置已保存");
  };

  const handleChange = () => {
    setIsChanged(true);
  };

  return (
    <>
      <GlobalClass />
      {renderButton(openDrawer)}
      <Drawer
        width={"60%"}
        title={<span>设置 </span>}
        visible={visible}
        autoFocus={false}
        unmountOnExit
        footer={null}
      >
        <Form
          ref={formRef}
          initialValues={config}
          onChange={handleChange}
          scrollToFirstError
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 21,
          }}
          labelAlign="left"
        >
          <BackendURL />
          <Sync />
          <Collapse className={"config-collapse"}>
            <Collapse.Item header="开发者信息" name="1">
              <FormItem label="clientId" field={config.clientId}>
                <span>{config.clientId}</span>
              </FormItem>
              <FormItem label="clientSecret" field={config.clientSecret}>
                <span>{config.clientSecret}</span>
              </FormItem>
            </Collapse.Item>
          </Collapse>
        </Form>
      </Drawer>
    </>
  );
};
