import { action } from '@storybook/addon-actions';
import { useFetch } from '@vueuse/core';
import {
  computed, markRaw, onBeforeUnmount, ref,
} from 'vue';

import { SortDirection } from '../../enums';
import * as SortDirectionCycle from '../../enums/sort-direction-cycle';
import EcDateRangeFilter from '../ec-date-range-filter';
import EcIcon from '../ec-icon';
import EcOptionCard from '../ec-option-card';
import EcSyncMultipleValuesFilter from '../ec-sync-multiple-values-filter';
import EcTextFilter from '../ec-text-filter';
import EcSmartTable from './ec-smart-table.vue';

const defaultFilters = [{
  label: 'Payment status',
  name: 'paymentStatus',
  component: markRaw(EcSyncMultipleValuesFilter),
  items: [{ text: 'Paid', value: 'paid' }, { text: 'Cancelled', value: 'canceled' }, { text: 'Overdue', value: 'overdue' }],
  isSearchable: false,
  isSelectAll: false,
  selectAllFiltersText: '',
}, {
  label: 'Fee type',
  name: 'feeType',
  component: markRaw(EcSyncMultipleValuesFilter),
  items: [{ text: 'Invoiced', value: 'invoiced' }, { text: 'Payment', value: 'payment' }],
  isSearchable: false,
  isSelectAll: false,
  selectAllFiltersText: '',
}, {
  label: 'Due date',
  name: 'dueDate',
  component: markRaw(EcDateRangeFilter),
  fromLabelText: 'From',
  toLabelText: 'To',
  clearText: 'Clear dates',
  errorMessage: '',
}, {
  name: 'text',
  component: EcTextFilter,
  inputProps: {
    placeholder: 'Type here the text to search by',
  },
}];

const defaultStretchedFilters = [{
  label: 'Payment status',
  name: 'paymentStatus',
  component: markRaw(EcSyncMultipleValuesFilter),
  items: [{ text: 'Paid', value: 'paid' }, { text: 'Cancelled', value: 'canceled' }, { text: 'Overdue', value: 'overdue' }],
  isSearchable: false,
  isSelectAll: false,
  selectAllFiltersText: '',
}, {
  label: 'Fee type',
  name: 'feeType',
  component: markRaw(EcSyncMultipleValuesFilter),
  items: [{ text: 'Invoiced', value: 'invoiced' }, { text: 'Payment', value: 'payment' }],
  isSearchable: false,
  isSelectAll: false,
  selectAllFiltersText: '',
}, {
  label: 'Due date',
  name: 'dueDate',
  component: markRaw(EcDateRangeFilter),
  fromLabelText: 'From',
  toLabelText: 'To',
  clearText: 'Clear dates',
  errorMessage: '',
}, {
  name: 'text',
  component: EcTextFilter,
  isFullWidth: true,
  stretch: true,
  inputProps: {
    placeholder: 'Type here the text to search by',
  },
}];

const columns = [
  {
    name: 'request-details',
    title: 'Request details',
    sortable: true,
  },
  {
    name: 'original-amount',
    title: 'Original amount',
    sortable: true,
    sortCycle: SortDirectionCycle.HIGHEST_FIRST,
  },
  {
    name: 'repayment-date',
    title: 'Repayment date',
    sortable: true,
  },
  {
    title: 'Status',
    type: 'icon',
  },
];

const defaultSorts = [
  {
    direction: SortDirection.ASC,
    column: 'request-details',
  },
];

const fakeData = [
  [
    'Lorem',
    'ipsum',
    'dolor',
    'sit',
  ],
  [
    'foo',
    'bar',
    'baz',
    'sit',
  ],
];

const prefilters = {
  all: {},
  onlyOverdue: { paymentStatus: [{ text: 'Overdue', value: 'overdue' }], feeType: [{ text: 'Payment', value: 'payment' }] },
  onlyInvoiced: { feeType: [{ text: 'Invoiced', value: 'invoiced' }] },
  inThePast: { dueDate: { to: '2020-11-23' } },
};

export default {
  title: 'Smart Table',
  component: EcSmartTable,
};

function useSmartTableFetch(reqInit, { urlBuilder, ...options } = {}) {
  const url = ref(null);

  const {
    data,
    isFetching,
    error,
    abort,
    execute: refetch,
    ...fetch
  } = useFetch(url, {
    method: 'GET',
    ...reqInit,
  }, {
    refetch: true,
    immediate: false,
    ...options,
  }).json();

  function onFetch(payload) {
    const newUrl = urlBuilder(payload);

    abort();
    url.value = newUrl;
  }

  function execute() {
    abort();
    refetch();
  }

  onBeforeUnmount(abort);

  return {
    isFetching, error, abort, data, onFetch, execute, ...fetch,
  };
}

function useSmartTableSetup(args) {
  // sorting
  const sortCycle = computed(() => (
    // eslint-disable-next-line no-nested-ternary
    args.sortCycle === 'lowest first'
      ? SortDirectionCycle.LOWEST_FIRST
      : args.sortCycle === 'highest first'
        ? SortDirectionCycle.HIGHEST_FIRST
        : null
  ));

  // filters
  const filters = computed(() => (args.isFilteringEnabled ? defaultFilters : null));
  const stretchedFilters = computed(() => (args.isFilteringEnabled ? defaultStretchedFilters : null));
  const selectedFilter = computed(() => prefilters[args.prefilter]);

  // fake fetch API
  function fakeFetch(url, ctx) {
    const parsedUrl = new URL(url);
    action('fetching')(parsedUrl.hostname, parsedUrl.pathname, [...parsedUrl.searchParams.entries()]);
    const numberOfItems = Number(new URL(url).searchParams.get('numberOfItems'));

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        if (args.failOnFetch) {
          action('resolving with error')({});
          reject(new Error('Random error'));
        } else if (args.fetchEmptyList) {
          action('resolving empty response')({});
          resolve(new Response(JSON.stringify({
            items: [],
            total: 0,
            count: 0,
          })));
        } else {
          action('resolving with data')(args.fakeData);
          resolve(new Response(JSON.stringify({
            items: [...args.fakeData],
            total: 52,
            count: Math.min(args.fakeData.length, numberOfItems),
          })));
        }
      }, args.loadingDelay);

      ctx.signal.addEventListener('abort', () => {
        action('fetch cancelled')({});
        clearTimeout(timeoutId);
      });
    });
  }

  // fetch
  function urlBuilder({
    page, numberOfItems, sorts, filter, ...customProps
  } = {}) {
    const newUrl = new URL('/random/', 'http://example.com');
    newUrl.searchParams.append('page', page);
    newUrl.searchParams.append('numberOfItems', numberOfItems);
    if (filter && Object.keys(filter).length) {
      newUrl.searchParams.append('filter', JSON.stringify(filter));
    }
    if (sorts && sorts.length > 0) {
      newUrl.searchParams.append('sorts', JSON.stringify(sorts));
    }
    for (const [key, value] of Object.entries(customProps)) {
      newUrl.searchParams.append(key, JSON.stringify(value));
    }

    return newUrl.href;
  }

  const {
    isFetching, error, data, onFetch, execute,
  } = useSmartTableFetch({}, { fetch: fakeFetch, urlBuilder });

  // infinite scroll
  const infiniteScrollMappedData = ref([...args.fakeData]);

  function getInfiniteScrollMappedData(payload) {
    // 500ms delay to show the loading icon
    setTimeout(() => {
      if (!payload.sorts.length) {
        payload.sorts = defaultSorts;
      }

      const areSortsDifferent = payload.sorts[0].column !== args.pagination.sorts[0].column
      || payload.sorts[0].direction !== args.pagination.sorts[0].direction;

      if (areSortsDifferent) {
        infiniteScrollMappedData.value = [];

        args.pagination.sorts = payload.sorts.length
          ? [{
            column: payload.sorts[0].column,
            direction: payload.sorts[0].direction,
          }]
          : defaultSorts;
      }

      infiniteScrollMappedData.value = [
        ...infiniteScrollMappedData.value,
        ...args.fakeData,
      ];
    }, 500);
  }

  return {
    data,
    isFetching,
    error,
    onFetch,
    execute,
    sortCycle,
    filters,
    stretchedFilters,
    selectedFilter,
    infiniteScrollMappedData,
    getInfiniteScrollMappedData,
    onSort: action('sort'),
    onAbort: action('abort'),
    onError: action('error'),
    onDownload: action('download'),
  };
}

export const basic = args => ({
  components: { EcSmartTable, EcIcon },
  setup() {
    return {
      ...useSmartTableSetup(args),
      args,
    };
  },
  template: `
    <div class="tw-flex tw-h-screen tw-px-20">
      <div class="tw-my-auto tw-mx-20 tw-w-full ec-card">
        <ec-smart-table
          v-bind="{
            ...args,
            data: data?.items,
            totalRecords: data?.total ?? 0,
            isFetching,
            error,
            sortCycle,
            filters,
            filter: selectedFilter,
            loadingDelay: null,
            failOnFetch: null,
            fakeData: null,
            fetchEmptyList: null,
            isFilteringEnabled: null,
            prefilter: null,
          }"
          v-on="{
            fetch: onFetch,
            sort: onSort,
            abort: onAbort,
            error: onError,
          }">
          <template #header-actions="{ total, items, error, loading }">
            <a
              href="#"
              v-if="!error && !loading"
              @click.prevent.stop="onDownload">Download all {{ total }} item(s)</a>
            <a @click.prevent.stop="execute()" href="#">Reload</a>
          </template>
          <template #error="{ errorMessage }">
            <div class="tw-text-center tw-text-error tw-py-48">
              <div><ec-icon name="simple-error" :size="48" class="tw-fill-error" /></div>
              {{ errorMessage }}
            </div>
          </template>
          <template #empty="{ emptyMessage }">
            <div class="tw-text-center tw-py-48">
              <div><ec-icon name="simple-info" :size="48" /></div>
              {{ emptyMessage }}
            </div>
          </template>
          <template #footer><div class="tw-text-right">Custom footer info</div></template>
          <template #pages="{ page, totalPages, total }">{{ page }}&nbsp;of&nbsp;{{ totalPages }} pages ({{ total }}&nbsp;ipsums)</template>
        </ec-smart-table>
      </div>
    </div>
  `,
});

basic.argTypes = {
  stickyColumn: {
    options: ['left', 'right'],
    control: { type: 'select' },
  },
  sortCycle: {
    options: ['lowest first', 'highest first'],
    control: { type: 'select' },
  },
  prefilter: {
    options: Object.keys(prefilters),
    control: { type: 'select' },
  },
};

basic.args = {
  title: 'Title',
  columns,
  sorts: defaultSorts,
  pagination: {
    page: 2,
    numberOfItems: 5,
    sorts: defaultSorts,
  },
  isMultiSort: false,
  additionalPayload: { customProp: 'customValue' },
  maxHeight: '',
  loadingDelay: 500,
  failOnFetch: false,
  fetchEmptyList: false,
  fakeData,
  isPaginationEnabled: true,
  isFilteringEnabled: true,
  prefilter: 'all',
};

basic.parameters = {
  visualRegressionTests: {
    waitOn: '.ec-table',
  },
};

export const all = args => ({
  components: { EcSmartTable, EcIcon, EcOptionCard },
  setup() {
    return {
      ...useSmartTableSetup(args),
      args,
    };
  },
  template: `
  <h2 class="tw-m-24">Basic</h2>
  <div class="tw-flex tw-px-20">
      <div class="tw-my-auto tw-mx-20 tw-w-full ec-card">
        <ec-smart-table
          v-bind="{
            ...args,
            data: data?.items,
            totalRecords: data?.total ?? 0,
            isFetching,
            error,
            sortCycle,
            filters,
            filter: selectedFilter,
            loadingDelay: null,
            failOnFetch: null,
            fakeData: null,
            fetchEmptyList: null,
            isFilteringEnabled: null,
            prefilter: null,
            isResponsive: false,
          }"
          v-on="{
            fetch: onFetch,
            sort: onSort,
            abort: onAbort,
            error: onError,
          }">
          <template #header-actions="{ total, items, error, loading }">
            <a
              href="#"
              v-if="!error && !loading"
              @click.prevent.stop="onDownload">Download all {{ total }} item(s)</a>
            <a @click.prevent.stop="execute()" href="#">Reload</a>
          </template>
          <template #error="{ errorMessage }">
            <div class="tw-text-center tw-text-error tw-py-48">
              <div><ec-icon name="simple-error" :size="48" class="tw-fill-error" /></div>
              {{ errorMessage }}
            </div>
          </template>
          <template #empty="{ emptyMessage }">
            <div class="tw-text-center tw-py-48">
              <div><ec-icon name="simple-info" :size="48" /></div>
              {{ emptyMessage }}
            </div>
          </template>
          <template #footer><div class="tw-text-right">Custom footer info</div></template>
          <template #pages="{ page, totalPages, total }">{{ page }}&nbsp;of&nbsp;{{ totalPages }} pages ({{ total }}&nbsp;ipsums)</template>
        </ec-smart-table>
      </div>
    </div>
    <h2 class="tw-m-24">With custom row from threshold</h2>
    <div class="tw-flex tw-px-20">
      <div class="tw-my-auto tw-mx-20 tw-w-full ec-card">
        <ec-smart-table
          v-bind="{
            ...args,
            data: data?.items,
            totalRecords: data?.total ?? 0,
            isFetching,
            error,
            sortCycle,
            filters,
            filter: selectedFilter,
            loadingDelay: null,
            failOnFetch: null,
            fakeData: null,
            fetchEmptyList: null,
            isFilteringEnabled: null,
            prefilter: null,
          }"
          v-on="{
            fetch: onFetch,
            sort: onSort,
            abort: onAbort,
            error: onError,
          }">
          <template #header-actions="{ total, items, error, loading }">
            <a
              href="#"
              v-if="!error && !loading"
              @click.prevent.stop="onDownload">Download all {{ total }} item(s)</a>
            <a @click.prevent.stop="execute()" href="#">Reload</a>
          </template>
          <template #error="{ errorMessage }">
            <div class="tw-text-center tw-text-error tw-py-48">
              <div><ec-icon name="simple-error" :size="48" class="tw-fill-error" /></div>
              {{ errorMessage }}
            </div>
          </template>
          <template #empty="{ emptyMessage }">
            <div class="tw-text-center tw-py-48">
              <div><ec-icon name="simple-info" :size="48" /></div>
              {{ emptyMessage }}
            </div>
          </template>
          <template v-slot="{ row }">
            <ec-option-card>
              <div class="tw-flex tw-justify-between tw-align-center">
                <p>{{ row[0] }}</p>
                <p>{{ row[1] }}</p>
              </div>
              <div class="tw-flex tw-justify-between tw-align-center">
                <p>{{ row[2] }}</p>
                <p>{{ row[3] }}</p>
              </div>
            </ec-option-card>
          </template>
          <template #footer><div class="tw-text-right">Custom footer info</div></template>
          <template #pages="{ page, totalPages, total }">{{ page }}&nbsp;of&nbsp;{{ totalPages }} pages ({{ total }}&nbsp;ipsums)</template>
        </ec-smart-table>
        <p class="tw-mt-40">
        <em>NOTE:</em> Custom rows are visible when the window size is lower than 768px. Here in Storybook,
        window width may not be as it should due to the sidebar menu, you can hide it by
        pressing "S" on your keyboard.
      </p>
      </div>
    </div>
    <h2 class="tw-m-24">With always shown custom row and hidden pagination size and custom info</h2>
    <div class="tw-flex tw-px-20">
      <div class="tw-my-auto tw-mx-20 tw-w-full ec-card">
        <ec-smart-table
          v-bind="{
            ...args,
            data: data?.items,
            totalRecords: data?.total ?? 0,
            isFetching,
            error,
            sortCycle,
            filters,
            filter: selectedFilter,
            loadingDelay: null,
            failOnFetch: null,
            fakeData: null,
            fetchEmptyList: null,
            isFilteringEnabled: null,
            prefilter: null,
            isCustomRowShown: true,
            isPageSizeHidden: true,
            isTotalHidden: true,
          }"
          v-on="{
            fetch: onFetch,
            sort: onSort,
            abort: onAbort,
            error: onError,
          }">
          <template #header-actions="{ total, items, error, loading }">
            <a
              href="#"
              v-if="!error && !loading"
              @click.prevent.stop="onDownload">Download all {{ total }} item(s)</a>
            <a @click.prevent.stop="execute()" href="#">Reload</a>
          </template>
          <template #error="{ errorMessage }">
            <div class="tw-text-center tw-text-error tw-py-48">
              <div><ec-icon name="simple-error" :size="48" class="tw-fill-error" /></div>
              {{ errorMessage }}
            </div>
          </template>
          <template #empty="{ emptyMessage }">
            <div class="tw-text-center tw-py-48">
              <div><ec-icon name="simple-info" :size="48" /></div>
              {{ emptyMessage }}
            </div>
          </template>
          <template v-slot="{ row }">
            <ec-option-card>
              <div class="tw-flex tw-justify-between tw-align-center">
                <p>{{ row[0] }}</p>
                <p>{{ row[1] }}</p>
              </div>
              <div class="tw-flex tw-justify-between tw-align-center">
                <p>{{ row[2] }}</p>
                <p>{{ row[3] }}</p>
              </div>
            </ec-option-card>
          </template>
          <template #footer><div class="tw-text-right">Custom footer info</div></template>
          <template #pages="{ page, totalPages, total }">{{ page }}&nbsp;of&nbsp;{{ totalPages }} pages ({{ total }}&nbsp;ipsums)</template>
        </ec-smart-table>
      </div>
    </div>
    <h2 class="tw-m-24">With stretched filters</h2>
    <div class="tw-flex tw-px-20">
      <div class="tw-my-auto tw-mx-20 tw-w-full ec-card">
        <ec-smart-table
          v-bind="{
            ...args,
            data: data?.items,
            totalRecords: data?.total ?? 0,
            isFetching,
            error,
            sortCycle,
            filters: stretchedFilters,
            filter: selectedFilter,
            loadingDelay: null,
            failOnFetch: null,
            fakeData: null,
            fetchEmptyList: null,
            isFilteringEnabled: null,
            prefilter: null,
            isResponsive: false,
          }"
          v-on="{
            fetch: onFetch,
            sort: onSort,
            abort: onAbort,
            error: onError,
          }">
          <template #header-actions="{ total, items, error, loading }">
            <a
              href="#"
              v-if="!error && !loading"
              @click.prevent.stop="onDownload">Download all {{ total }} item(s)</a>
            <a @click.prevent.stop="execute()" href="#">Reload</a>
          </template>
          <template #error="{ errorMessage }">
            <div class="tw-text-center tw-text-error tw-py-48">
              <div><ec-icon name="simple-error" :size="48" class="tw-fill-error" /></div>
              {{ errorMessage }}
            </div>
          </template>
          <template #empty="{ emptyMessage }">
            <div class="tw-text-center tw-py-48">
              <div><ec-icon name="simple-info" :size="48" /></div>
              {{ emptyMessage }}
            </div>
          </template>
          <template #footer><div class="tw-text-right">Custom footer info</div></template>
          <template #pages="{ page, totalPages, total }">{{ page }}&nbsp;of&nbsp;{{ totalPages }} pages ({{ total }}&nbsp;ipsums)</template>
        </ec-smart-table>
      </div>
    </div>
    <h2 class="tw-m-24">With infinite scrolling</h2>
    <div class="tw-flex tw-px-20">
      <div class="tw-my-auto tw-mx-20 tw-w-full ec-card">
        <ec-smart-table
          v-bind="{
            ...args,
            data: infiniteScrollMappedData,
            totalRecords: data?.total ?? 0,
            isFetching,
            error,
            sortCycle,
            filters,
            filter: selectedFilter,
            loadingDelay: null,
            failOnFetch: null,
            fakeData: null,
            fetchEmptyList: null,
            isFilteringEnabled: null,
            prefilter: null,
            isCustomRowShown: false,
            isPaginationEnabled: false,
            isInfiniteScrollEnabled: true,
          }"
          v-on="{
            fetch: getInfiniteScrollMappedData,
            sort: onSort,
            abort: onAbort,
            error: onError,
          }">
          <template #header-actions="{ total, items, error, loading }">
            <a
              href="#"
              v-if="!error && !loading"
              @click.prevent.stop="onDownload">Download all {{ total }} item(s)</a>
            <a @click.prevent.stop="execute()" href="#">Reload</a>
          </template>
          <template #error="{ errorMessage }">
            <div class="tw-text-center tw-text-error tw-py-48">
              <div><ec-icon name="simple-error" :size="48" class="tw-fill-error" /></div>
              {{ errorMessage }}
            </div>
          </template>
          <template #empty="{ emptyMessage }">
            <div class="tw-text-center tw-py-48">
              <div><ec-icon name="simple-info" :size="48" /></div>
              {{ emptyMessage }}
            </div>
          </template>
          <template v-slot="{ row }">
            <ec-option-card>
              <div class="tw-flex tw-justify-between tw-align-center">
                <p>{{ row[0] }}</p>
                <p>{{ row[1] }}</p>
              </div>
              <div class="tw-flex tw-justify-between tw-align-center">
                <p>{{ row[2] }}</p>
                <p>{{ row[3] }}</p>
              </div>
            </ec-option-card>
          </template>
        </ec-smart-table>
      </div>
    </div>
  `,
});

all.args = {
  ...basic.args,
};
all.parameters = {
  visualRegressionTests: {
    waitOn: '.ec-table',
  },
};
