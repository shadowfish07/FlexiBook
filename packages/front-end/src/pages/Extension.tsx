import { Message } from "@arco-design/web-react";
import { AddBookmark } from "../components";

export function Extension() {
  const handleSave = () => {
    Message.success("添加成功");
  };
  return (
    <div
      style={{ backgroundColor: "#373739", width: 300, padding: "12px 16px" }}
    >
      <AddBookmark fromExtension onSave={handleSave} />
    </div>
  );
}
