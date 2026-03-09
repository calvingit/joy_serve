import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AppShell from "./AppShell";
import { D } from "../../constants/data";
import Btn from "../common/components/Btn";
import Card from "../common/components/Card";
import Chip from "../common/components/Chip";

describe("DashStack visual baseline", () => {
  it("为共享组件提供更轻的仪表盘视觉基线", () => {
    const { container } = render(<Btn v="primary">主要操作</Btn>);
    const { container: cardContainer } = render(<Card>卡片</Card>);
    render(<Chip type="brand">品牌标签</Chip>);

    expect(D.bgPage).toBe("#F5F6FA");
    expect(D.radiusCard).toBe(20);
    expect(container.querySelector("button")).toHaveStyle({
      background: "#4880FF",
      borderRadius: "14px",
    });
    expect(cardContainer.firstChild.style.borderRadius).toBe("20px");
  });

  it("保持导航切换能力并展示当前页面标题", async () => {
    render(<AppShell />);

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /智能营销/ }));
    expect(screen.getByRole("heading", { name: "智能营销" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /AI 客服/ }));
    expect(screen.getByRole("heading", { name: "AI 客服中心" })).toBeInTheDocument();
  });
});
