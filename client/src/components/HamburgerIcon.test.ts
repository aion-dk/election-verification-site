import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HamburgerIcon from "./HamburgerIcon.vue";

describe("HamburgerIcon", () => {
  it("renders an svg with three horizontal lines", () => {
    const wrapper = mount(HamburgerIcon);

    const svg = wrapper.find("svg");
    expect(svg.attributes("viewBox")).toBe("0,0,6,6");
    expect(svg.attributes("height")).toBe("1em");
    expect(svg.attributes("stroke-linecap")).toBe("square");

    const lines = wrapper.findAll("line");
    expect(lines).toHaveLength(3);
    expect(
      lines.map((l) => [
        l.attributes("x1"),
        l.attributes("y1"),
        l.attributes("x2"),
        l.attributes("y2"),
      ]),
    ).toEqual([
      ["1", "1", "5", "1"],
      ["1", "3", "5", "3"],
      ["1", "5", "5", "5"],
    ]);
  });

  it("uses a black stroke by default", () => {
    const wrapper = mount(HamburgerIcon);

    expect(wrapper.find("svg").attributes("stroke")).toBe("black");
  });

  it("uses the given stroke colour", () => {
    const wrapper = mount(HamburgerIcon, { props: { stroke: "white" } });

    expect(wrapper.find("svg").attributes("stroke")).toBe("white");
  });
});
