import { mount } from '@vue/test-utils';

import { withMockedConsole } from '../../../tests/utils/console';
import EcBadge from './ec-badge.vue';

describe('EcBadge', () => {
  function mountBadge(props, mountOpts) {
    return mount(EcBadge, {
      props: {
        value: 'A random value',
        ...props,
      },
      ...mountOpts,
    });
  }

  it('should render as expected with a string value', () => {
    const wrapper = mountBadge({
      value: 'Random value',
    });

    expect(wrapper.findByDataTest('ec-badge').exists()).toBe(true);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render as expected with a number value', () => {
    const wrapper = mountBadge({
      value: 1,
    });

    expect(wrapper.findByDataTest('ec-badge').exists()).toBe(true);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should throw if prop value has not the correct type', () => {
    withMockedConsole((_errorSpy, warnSpy) => {
      mountBadge({ value: true });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain(
        'Invalid prop: type check failed for prop "value".',
      );
    });
  });

  it('should throw if no props were given', () => {
    withMockedConsole((_errorSpy, warnSpy) => {
      mount(EcBadge);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain(
        'Missing required prop: "value"',
      );
    });
  });

  it.each(['error', 'info', 'success', 'warning'])('should use the type "%s"', (type) => {
    const wrapper = mountBadge({ type });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should throw an error if type is not valid', () => {
    withMockedConsole((_errorSpy, warnSpy) => {
      mountBadge({ type: 'invalid-value' });
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain(
        'Invalid prop: custom validator check failed for prop "type"',
      );
    });
  });

  it('should render with the default slot given', () => {
    const wrapper = mountBadge(
      {
        value: 'a random value',
      },
      {
        slots: {
          default: `
            <template #default="{ value }">   
                Custom: {{ value }}
            </template>`,
        },
      },
    );
    expect(wrapper.element).toMatchSnapshot();
  });
});
