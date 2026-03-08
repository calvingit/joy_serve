import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Marketing from "./Marketing";
import { resetMarketingMockDB } from "../../services/marketingMockApi";

describe("Marketing page", () => {
  const toast = { show: vi.fn() };

  beforeEach(() => {
    resetMarketingMockDB();
    toast.show.mockClear();
  });

  it("加载后展示核心模块并支持切换Tab", async () => {
    render(<Marketing toast={toast} />);
    expect(screen.getByText("正在加载营销数据...")).toBeInTheDocument();

    expect(await screen.findByText("主动关怀时间线")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /评价运营/ }));
    expect(await screen.findByText("评价运营队列")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /优惠券管理/ }));
    expect(await screen.findByText("优惠券发放与核销趋势")).toBeInTheDocument();
  });

  it("支持批量生成评价回复", async () => {
    render(<Marketing toast={toast} />);
    await userEvent.click(await screen.findByRole("button", { name: /评价运营/ }));
    await screen.findByText("评价运营队列");

    const checkboxes = await screen.findAllByRole("checkbox");
    await userEvent.click(checkboxes[0]);
    await userEvent.click(screen.getByRole("button", { name: /批量生成回复/ }));

    await waitFor(() => {
      expect(toast.show).toHaveBeenCalledWith("已生成并发送 AI 建议回复", "success");
    });
  });
});
