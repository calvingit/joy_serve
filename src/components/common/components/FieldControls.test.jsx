import { render, screen } from "@testing-library/react";
import Input from "./Input";
import Sel from "./Sel";
import Textarea from "./Textarea";

describe("shared form controls", () => {
  it("透传 id 和 name 到底层表单控件", () => {
    render(
      <div>
        <Input id="email-field" name="email" value="" onChange={() => {}} />
        <Textarea id="note-field" name="note" value="" onChange={() => {}} />
        <Sel
          id="role-field"
          name="role"
          value="admin"
          onChange={() => {}}
          opts={[
            { v: "admin", l: "管理员" },
            { v: "viewer", l: "访客" },
          ]}
        />
      </div>,
    );

    const [input, textarea] = screen.getAllByRole("textbox");
    expect(input).toHaveAttribute("id", "email-field");
    expect(input).toHaveAttribute("name", "email");
    expect(textarea).toHaveAttribute("id", "note-field");
    expect(textarea).toHaveAttribute("name", "note");
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "role-field");
    expect(screen.getByRole("combobox")).toHaveAttribute("name", "role");
  });
});
