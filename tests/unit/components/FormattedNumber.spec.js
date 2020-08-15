import FormattedNumber from "@/components/FormattedNumber.vue";

import { shallowMount, mount } from "@vue/test-utils";

describe("FormattedNumber.vue", () => {
  // FIXME: Test different format options
  const formatOptions = {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "narrowSymbol",
  };

  it("formats value to given formatOptions", () => {
    const value = 0.9;
    const wrapper = mount(FormattedNumber, {
      propsData: { value, formatOptions },
    });
    const input = wrapper.find("input");

    expect(input.element.value).toBe(
      value.toLocaleString(navigator.language, formatOptions)
    );
  });
  // FIXME: The navigator.locale is eng so the EURO sign is ahead of the number and parsing fails
  xit("shows actual value when focused", async () => {
    const value = 0.3;
    const wrapper = mount(FormattedNumber, {
      propsData: { value, formatOptions },
    });
    const input = wrapper.find("input");
    await input.trigger("focus");

    expect(input.element.value).toBe(value + "");
  });

  it("doesn't allow input greater than max on input", async () => {
    const value = 0.003;
    const wrapper = mount(FormattedNumber, {
      propsData: { value, max: 0.7, formatOptions },
    });
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.setValue(0.8);

    expect(input.element.value).toBe(0.7 + "");
  });
  it("doesn't allow input less than min on input", async () => {
    const value = 0.003;
    const wrapper = mount(FormattedNumber, {
      propsData: { value, min: 0, formatOptions },
    });
    const input = wrapper.find("input");

    await input.trigger("focus");
    await input.setValue(-0.8);

    expect(input.element.value).toBe(0 + "");
  });

  it("clamps value prop to min/max bounds", async () => {
    const value = 0.9;
    const wrapper = mount(FormattedNumber, {
      propsData: { value, max: 0.8, formatOptions },
    });
    const input = wrapper.find("input");

    expect(input.element.value).toBe(
      (0.8).toLocaleString(navigator.language, formatOptions)
    );
  });

  it("emits 'input' event when input is changed", async () => {
    const value = 0.9;
    const wrapper = mount(FormattedNumber, {
      propsData: { value, formatOptions },
    });
    const input = wrapper.find("input");

    input.element.value = 0.1;
    input.trigger("input");

    expect(wrapper.emitted().input[0][0]).toBe(0.1);
  });
});
