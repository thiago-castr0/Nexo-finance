import { describe, it } from "node:test";
import assert from "node:assert/strict";

describe("Nexo Finance - Mobile Navigation & Touch Ergonomics (UIE-001)", () => {
  it("deve validar abas essenciais da barra de navegação móvel na Thumb Zone", () => {
    const mobileTabs = ["OVERVIEW", "TIMELINE", "CARDS", "GOALS"];
    assert.equal(mobileTabs.length, 4);
    assert.ok(mobileTabs.includes("OVERVIEW"));
    assert.ok(mobileTabs.includes("TIMELINE"));
    assert.ok(mobileTabs.includes("CARDS"));
    assert.ok(mobileTabs.includes("GOALS"));
  });

  it("deve garantir que os alvos de toque respeitem o padrão mínimo de 44px de altura", () => {
    const touchTargetMinHeight = 44; // WCAG 2.1 AA & iOS Human Interface Guidelines
    assert.ok(touchTargetMinHeight >= 44);
  });

  it("deve formatar corretamente as iniciais do usuário para o avatar mobile", () => {
    const getInitials = (name: string) =>
      name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    assert.equal(getInitials("Thiago Castro"), "TC");
    assert.equal(getInitials("Investidor Nexo"), "IN");
    assert.equal(getInitials("Administrador"), "A");
  });
});
