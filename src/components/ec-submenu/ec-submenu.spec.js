import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';

import { withMockedConsole } from '../../../tests/utils/console';
import EcSubmenu from './ec-submenu.vue';

const submenu = [
  {
    headerTitle: 'Submitted Requests (30)',
    slotName: 'menu-item-1-content',
  },
  {
    headerTitle: 'Repayments (30)',
    route: '/submitted',
    slotName: 'menu-item-2-content',
  },
  {
    headerTitle: 'Another Request (30)',
    route: '/submitted',
    slotName: 'menu-item-3-content',
  },
];

const lorem = '<p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Temporibus, tempora esse? Fugit minus consequatur harum culpa sed laborum nulla expedita molestias, quia cupiditate commodi repudiandae labore dolore dolor. Eum sapiente repellendus tempora tenetur accusantium, molestias hic adipisci aspernatur, sed possimus explicabo culpa quas laudantium?</p>';

const slots = {
  'menu-item-1-content': lorem,
  'menu-item-2-content': lorem,
  'menu-item-3-content': lorem,
};

describe('EcSubmenu', () => {
  function mountSubmenu(props, mountOpts) {
    return mount(EcSubmenu, {
      props: { ...props },
      ...mountOpts,
    });
  }

  function mountSubmenuAsTemplate(template, props, wrapperComponentOpts, mountOpts) {
    const element = document.createElement('div');
    document.body.appendChild(element);

    const Component = defineComponent({
      components: { EcSubmenu },
      template,
      ...wrapperComponentOpts,
    });

    return mount(Component, {
      props,
      attachTo: element,
      ...mountOpts,
    });
  }

  it('should throw an error if we don\'t pass any content', () => {
    withMockedConsole((errorSpy, warnSpy) => {
      mount(EcSubmenu);
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('Missing required prop: "submenu"');
    });
  });

  it('should not render when passing null to submenu', () => {
    withMockedConsole((errorSpy, warnSpy) => {
      const wrapper = mountSubmenu(
        { submenu: null },
        {
          slots,
        },
      );
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('Expected Array, got Null ');
      expect(wrapper.findByDataTest('ec-submenu').exists()).toBe(false);
      expect(wrapper.element).toMatchSnapshot();
    });
  });

  it('should not render when passing an empty array to submenu', () => {
    const wrapper = mountSubmenu(
      { submenu: [] },
      {
        slots,
      },
    );

    expect(wrapper.findByDataTest('ec-submenu').exists()).toBe(false);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render with custom attributes', () => {
    const wrapper = mountSubmenu({
      submenu,
    }, {
      attrs: {
        'data-test': 'my-data-test',
        class: 'my-class',
        id: 'test-id',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render the second panel if the second tab is clicked', async () => {
    const wrapper = mountSubmenuAsTemplate(
      '<ec-submenu :submenu="submenu" v-model:activeIndex="activeIndex"/>',
      {},
      {
        data() {
          return {
            submenu,
            activeIndex: 0,
          };
        },
      },
    );

    expect(wrapper.findByDataTest('ec-submenu__panel-0').isVisible()).toBe(true);
    expect(wrapper.findByDataTest('ec-submenu__panel-1').isVisible()).toBe(false);

    await wrapper.findByDataTest('ec-submenu__header-title-1').trigger('click');
    expect(wrapper.findByDataTest('ec-submenu__panel-1').isVisible()).toBe(true);
    expect(wrapper.findByDataTest('ec-submenu__panel-0').isVisible()).toBe(false);
    expect(wrapper.vm.activeIndex).toBe(1);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render properly if isFullWidth prop is set', () => {
    const wrapper = mountSubmenu(
      { submenu, activeIndex: 0, isFullWidth: true },
      { slots },
    );

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should render properly if hasHeaderGap prop is set to false', () => {
    const wrapper = mountSubmenu(
      { submenu, activeIndex: 0, hasHeaderGap: false },
    );

    expect(wrapper.element).toMatchSnapshot();
  });

  it('should emit change event when index gets changed', async () => {
    const wrapper = mountSubmenu(
      { submenu, activeIndex: 0 },
      { slots },
    );

    await wrapper.findByDataTest('ec-submenu__header-title-1').trigger('click');
    expect(wrapper.emitted('change').length).toBe(1);
    expect(wrapper.emitted('update:activeIndex').length).toBe(1);
  });
});
