import { Layout } from "@arco-design/web-react";
import Sider from "@arco-design/web-react/es/Layout/sider";
import { Header, Content, SideMenu } from "../components";

export function WebApp() {
  return (
    <Layout
      style={{
        height: "100%",
        backgroundImage: `url("/background.jpg")`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Sider
        resizeDirections={["right"]}
        style={{
          backgroundColor: "rgba(35, 35, 36, 0.9)",
          backdropFilter: "blur(5px)",
          minWidth: 200,
        }}
      >
        <SideMenu />
      </Sider>
      <Layout>
        <Header />
        <Content />
      </Layout>
    </Layout>
  );
}
