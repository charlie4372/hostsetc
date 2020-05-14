import {Hosts} from "@common/hosts";
import {
  convertHostsToNavigationDrawItems,
  convertNavigationDrawItemsToHosts
} from '@renderer/views/app/AppNavigationDrawerListConvert';
import {NavigationDrawItem} from "@renderer/views/app/types";

function createSampleHosts(): Hosts {
  return {
    categories: [
      {
        name: 'Default',
        entries: [
          {
            name: 'Main',
            value: '127.0.0.1 localhost',
            active: true
          },
          {
            name: 'Apple',
            value: '10.0.0.1 apple.com',
            active: true
          }
        ]
      },
      {
        name: 'Development',
        entries: [
          {
            name: 'Dev1',
            value: '10.0.0.2 dev.hostetc.com',
            active: true
          },
          {
            name: 'Dev2',
            value: '192.168.0.2 dev.hostetc.com',
            active: false
          }
        ]
      },
      {
        name: 'Staging',
        entries: [
          {
            name: 'Staging1',
            value: '100.0.0.1 staging.hostetc.com',
            active: true
          },
          {
            name: 'Staging2',
            value: '199.0.0.1 staging.hostetc.com',
            active: false
          }
        ]
      }
    ]
  }
}

function createSampleNavigationDrawerItems(): NavigationDrawItem[] {
  return [
    {
      "categoryIndex": 0,
      "action": "view-category",
      "label": "Default",
      "titleCss": "font-weight-bold",
      "hidden": true
    } as NavigationDrawItem,
    {
      "categoryIndex": 0,
      "entryIndex": 0,
      "action": "view-entry",
      "label": "Main"
    } as NavigationDrawItem,
    {
      "categoryIndex": 0,
      "entryIndex": 1,
      "action": "view-entry",
      "label": "Apple"
    } as NavigationDrawItem,
    {
      "categoryIndex": 0,
      "action": "add-entry",
      "label": "New entry",
      "titleCss": "text--secondary"
    } as NavigationDrawItem,
    {
      "categoryIndex": 0,
      "action": "add-category",
      "label": "New category",
      "titleCss": "text--secondary"
    } as NavigationDrawItem,
    {
      "label": "Separator"
    } as NavigationDrawItem,
    {
      "categoryIndex": 1,
      "action": "view-category",
      "label": "Development",
      "titleCss": "font-weight-bold"
    } as NavigationDrawItem,
    {
      "categoryIndex": 1,
      "entryIndex": 0,
      "action": "view-entry",
      "label": "Dev1"
    } as NavigationDrawItem,
    {
      "categoryIndex": 1,
      "entryIndex": 1,
      "action": "view-entry",
      "label": "Dev2"
    } as NavigationDrawItem,
    {
      "categoryIndex": 1,
      "action": "add-entry",
      "label": "New entry",
      "titleCss": "text--secondary"
    } as NavigationDrawItem,
    {
      "label": "Separator"
    },
    {
      "categoryIndex": 2,
      "action": "view-category",
      "label": "Staging",
      "titleCss": "font-weight-bold"
    } as NavigationDrawItem,
    {
      "categoryIndex": 2,
      "entryIndex": 0,
      "action": "view-entry",
      "label": "Staging1"
    } as NavigationDrawItem,
    {
      "categoryIndex": 2,
      "entryIndex": 1,
      "action": "view-entry",
      "label": "Staging2"
    } as NavigationDrawItem,
    {
      "categoryIndex": 2,
      "action": "add-entry",
      "label": "New entry",
      "titleCss": "text--secondary"
    } as NavigationDrawItem,
    {
      "label": "Separator"
    } as NavigationDrawItem
  ]
}

test('Does hosts convert to navigation drawer list', () => {
  const hosts = createSampleHosts();
  const expectedResult = createSampleNavigationDrawerItems();

  const navigationDrawerList = convertHostsToNavigationDrawItems(hosts);

  expect(navigationDrawerList).toStrictEqual(expectedResult);
});


test('Does navigation drawer list convert to hosts', () => {
  const hosts = createSampleHosts()
  const navigationDrawerItems = createSampleNavigationDrawerItems();

  const convertedHosts = convertNavigationDrawItemsToHosts(navigationDrawerItems, hosts);

  expect(convertedHosts).toStrictEqual(hosts);
});
