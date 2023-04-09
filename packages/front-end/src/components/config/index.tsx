import { Collapse, Drawer, Form } from "@arco-design/web-react";
import FormItem from "@arco-design/web-react/es/Form/form-item";
import { useRef, useState } from "react";
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
  const { config } = useConfig();
  const formRef = useRef<any>();

  const openDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
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
        onOk={hideDrawer}
        onCancel={hideDrawer}
        unmountOnExit
        footer={null}
      >
        <Form
          ref={formRef}
          initialValues={config}
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
