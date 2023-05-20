import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Message,
} from "@arco-design/web-react";
import { useRef, useState } from "react";
import { useConfig } from "../hooks";
import { isString, pick } from "lodash";
import { useSharedContent } from "../hooks/useSharedContent";
import { useSavingState } from "../store/useSavingState";
import { BatchSyncReceiver } from "../utils/BatchSyncReceiver";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
};

export const AddSharedContentDialog = ({ visible, onCancel, onOk }: Props) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { httpHelper } = useConfig();
  const { addSharedContent, sharedContents } = useSharedContent();
  const { isSavingLocal, setIsSavingLocal } = useSavingState((state) =>
    pick(state, ["isSavingLocal", "setIsSavingLocal"])
  );

  const handleSubmit = async () => {
    setConfirmLoading(true);
    try {
      await form.validate();
      const url = form.getFieldValue("url");

      const result = await httpHelper.activateInvite(
        url,
        form.getFieldValue("nickname")
      );

      const content = await httpHelper.getSharedContentRemoteUpdate(
        new URL(url).origin,
        0,
        result.secret
      );

      const sharedContentWithData: Omit<SharedContent, "createdAt"> = (() => {
        let incrementalUpdateSerialNumber = 0;
        let resultData: Omit<SharedContent, "createdAt"> = {
          url: "",
          secret: "",
          nickname: "",
          incrementalUpdateSerialNumber: 0,
          data: {
            tags: new Map(),
            categories: new Map(),
            bookmarks: new Map(),
          },
        };

        const setIncrementalUpdateSerialNumber = async (
          serialNumber: number
        ) => {
          incrementalUpdateSerialNumber = serialNumber;
        };

        const setData = async (data: StorageData) => {
          resultData = {
            ...result,
            url,
            data,
            incrementalUpdateSerialNumber,
          };
        };

        const tempRef: React.MutableRefObject<StorageData> = {
          current: {
            tags: new Map(),
            bookmarks: new Map(),
            categories: new Map(),
          },
        };

        const batchSyncReceiver = new BatchSyncReceiver(
          tempRef,
          setData,
          setIncrementalUpdateSerialNumber,
          setIsSavingLocal
        );

        batchSyncReceiver.syncLocalData(content);

        return resultData;
      })();
      console.log(
        "🚀 ~ file: AddSharedContentDialog.tsx:49 ~ handleSubmit ~ sharedContentWithData:",
        sharedContentWithData
      );

      addSharedContent(sharedContentWithData);

      onOk();
    } catch (error) {
      if (isString(error)) {
        Message.error(error);
      }

      console.error(error);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Modal
      title="导入分享"
      visible={visible}
      onOk={handleSubmit}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
    >
      <Form form={form}>
        <Form.Item label="分享链接" field="url" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="你的昵称"
          field="nickname"
          rules={[{ required: true }]}
        >
          <Input placeholder="展示给对方的昵称" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
