import { action } from '@storybook/addon-actions';
import EcPhoneNumberInput from './ec-phone-number-input.vue';

export default {
  title: 'Phone Number Input',
  component: EcPhoneNumberInput,
};

export const basic = (args, { argTypes }) => ({
  components: { EcPhoneNumberInput },
  props: Object.keys(argTypes),
  data() {
    return {
      model: {
        country: this.$props.countries[0],
        phoneNumber: '1234567890',
      },
    };
  },
  methods: {
    onChange: action('change'),
    onFocus: action('focus'),
    onOpen: action('open'),
    onPhoneNumberChange: action('phone-phone-number-change'),
    onCountryChange: action('country-change'),
  },
  template: `
    <div class="tw-my-64 tw-mx-auto tw-max-w-screen-sm">
      <ec-phone-number-input
        v-bind="$props"
        v-on="{
          change: onChange,
          focus: onFocus,
          open: onOpen,
          'phone-number-change': onPhoneNumberChange,
          'country-change': onCountryChange
        }"
        v-model="model"
      />

      <p class="tw-mt-48">Value: {{ model }}</p>
    </div>
  `,
});

basic.args = {
  label: 'Phone number input',
  note: 'Select country and set number',
  bottomNote: 'Phone number can be up to 14 characters',
  isDisabled: false,
  countries: [
    { areaCode: '+44', text: 'United Kingdom', countryCode: 'GB' },
    { areaCode: '+34', text: 'Spain', countryCode: 'ES' },
    { areaCode: '+1 658', text: 'Jamaica', countryCode: 'JM' },
    { areaCode: '+260', text: 'Zambia', countryCode: 'ZM' },
    { areaCode: '+973', text: 'Bahrain', countryCode: 'BH' },
    { areaCode: '+201', text: 'New Country', countryCode: 'XX' },
  ],
};