import {
  Button,
  Drawer,
  Form,
  Input,
  Message,
  Modal,
  ResizeBox,
} from "@arco-design/web-react";
import FormItem from "@arco-design/web-react/es/Form/form-item";
import parseUrl from "parse-url";
import { useEffect, useRef, useState } from "react";
import { useConfig } from "../hooks";

type Props = {
  renderButton: (openDrawer: () => void) => JSX.Element;
};

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

  const handleDrawerOK = () => {
    formRef.current.submit();
  };

  const handleDrawerCancel = () => {
    if (isChanged) {
      Modal.confirm({
        title: "设置已更改，是否保存？",
        onOk: handleDrawerOK,
        onCancel: hideDrawer,
        simple: true,
      });
      return;
    }
    hideDrawer();
  };

  return (
    <>
      {renderButton(openDrawer)}
      <Drawer
        width={"60%"}
        title={<span>设置 </span>}
        visible={visible}
        onOk={handleDrawerOK}
        onCancel={handleDrawerCancel}
        autoFocus={false}
        okText="保存"
        unmountOnExit
      >
        <Form
          ref={formRef}
          initialValues={config}
          onSubmit={handleSubmit}
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
          <FormItem
            label="后端地址"
            field="backendURL"
            rules={[
              {
                validator(value, callback) {
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
            <Input />
          </FormItem>
          <FormItem label="clientId" field={config.clientId}>
            <span>{config.clientId}</span>
          </FormItem>
          <FormItem label="clientSecret" field={config.clientSecret}>
            <span>{config.clientSecret}</span>
          </FormItem>
        </Form>
      </Drawer>
    </>
  );
};
