import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  beforeEach(() => {
    document.documentElement.className = "dark";
    localStorage.clear();
  });

  it("toggles the <html> theme class and persists the choice to localStorage", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const toLight = screen.getByRole("button", { name: /switch to light theme/i });
    await user.click(toLight);

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("pulse-theme")).toBe("light");

    const toDark = screen.getByRole("button", { name: /switch to dark theme/i });
    await user.click(toDark);

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    expect(localStorage.getItem("pulse-theme")).toBe("dark");
  });
});
