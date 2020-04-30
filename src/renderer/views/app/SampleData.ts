import {Hosts} from "@common/hosts";

const sampleData: Hosts = {
  readonly: false,
  main: {
    name: 'Main',
    value: '127.0.0.1  localhost\r\n127.0.0.1  www.hosts-editor.com.au\r\n127.0.0.1  api.hosts-editor.com.au',
    active: true
  },
  entries: [],
  categories: [
    {
      name: 'Staging',
      entries: [
        {
          name: 'VM1',
          value: '10.0.51.1  www.hosts-editor.com.au\r\n10.0.51.2  api.hosts-editor.com.au',
          active: false
        },
        {
          name: 'VM2',
          value: '10.0.52.1  www.hosts-editor.com.au\r\n10.0.52.2  api.hosts-editor.com.au',
          active: false
        }
      ]
    },
    {
      name: 'AWS',
      entries: [
        {
          name: 'Australia East',
          value: '192.168.51.1  www.hosts-editor.com.au\r\n192.168.51.2  api.hosts-editor.com.au',
          active: false
        },
        {
          name: 'US West',
          value: '192.168.52.1  www.hosts-editor.com.au\r\n192.168.52.2  api.hosts-editor.com.au',
          active: false
        }
      ]
    },
    {
      name: 'Azure',
      entries: [
        {
          name: 'Australia East',
          value: '192.168.50.1  staging.hosts-editor.com.au',
          active: false
        },
        {
          name: 'US West',
          value: '192.168.50.2  staging.hosts-editor.com.au',
          active: false
        }
      ]
    }
  ]
}

export default sampleData;
