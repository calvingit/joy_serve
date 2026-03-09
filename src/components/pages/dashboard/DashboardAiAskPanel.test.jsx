import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardAiAskPanel from "./DashboardAiAskPanel";

describe("DashboardAiAskPanel layout", () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("首屏问答卡为桌面窄宽度保留最小可用宽度", () => {
    const toast = { show: vi.fn() };
    const { container } = render(<DashboardAiAskPanel toast={toast} />);

    const wrapper = container.firstChild;
    expect(wrapper.style.minWidth).toBe("620px");
    expect(wrapper.style.maxWidth).toBe("");
    expect(wrapper.style.margin).toBe("0px auto");
  });

  it("使用历史会话入口文案并放大会话弹框", async () => {
    const toast = { show: vi.fn() };
    render(<DashboardAiAskPanel toast={toast} />);

    await userEvent.click(screen.getByRole("button", { name: /历史会话/ }));

    const modalTitle = screen.getByText("AI 运营会话");
    expect(modalTitle.parentElement?.parentElement?.style.width).toBe("1120px");
  });

  it("首页发送问题后直接进入会话并清空首页输入", async () => {
    const toast = { show: vi.fn() };
    render(<DashboardAiAskPanel toast={toast} />);

    const input = screen.getByPlaceholderText("例如：今天有哪些运营异常需要优先处理？");
    await userEvent.type(input, "今天有哪些运营异常需要优先处理？");
    await userEvent.click(screen.getByRole("button", { name: /发送/ }));

    expect(screen.getByText("AI 运营会话")).toBeInTheDocument();
    expect(screen.getAllByText("今天有哪些运营异常需要优先处理？")[0]).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("已有历史会话时首页展示最近会话摘要并可继续会话", async () => {
    const toast = { show: vi.fn() };
    const { container } = render(<DashboardAiAskPanel toast={toast} />);

    const input = screen.getByPlaceholderText("例如：今天有哪些运营异常需要优先处理？");
    await userEvent.type(input, "请输出今日运营摘要");
    await userEvent.click(screen.getByRole("button", { name: /发送/ }));

    const modalTitle = screen.getByText("AI 运营会话");
    const closeButton = modalTitle.parentElement?.querySelector("button");
    await userEvent.click(closeButton);

    expect(screen.getByText("最近会话")).toBeInTheDocument();
    expect(screen.getAllByText("请输出今日运营摘要").length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole("button", { name: /继续会话/ }));
    expect(screen.getByText("AI 运营会话")).toBeInTheDocument();
    expect(container).not.toHaveTextContent("暂无会话记录");
  });

  it("无历史会话时弹框空态展示引导和常用指令", async () => {
    const toast = { show: vi.fn() };
    render(<DashboardAiAskPanel toast={toast} />);

    await userEvent.click(screen.getByRole("button", { name: /历史会话/ }));

    expect(screen.getByText("从一个运营问题开始")).toBeInTheDocument();
    expect(screen.getByText("/summary · 今日摘要")).toBeInTheDocument();
  });
});
