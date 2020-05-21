import {Hosts} from "@common/hosts";
import { v4 as uuidv4 } from 'uuid';

const sampleData: Hosts = {
  categories: [
    {
      id: uuidv4(),
      name: 'Default',
      entries: [
        {
          id: uuidv4(),
          name: 'Main',
          value: '127.0.0.1  localhost\r\n127.0.0.1  www.hosts-editor.com.au\r\n127.0.0.1  api.hosts-editor.com.au\r\n',
          active: true
        }
      ]
    },
    {
      id: uuidv4(),
      name: 'Staging',
      entries: [
        {
          id: uuidv4(),
          name: 'VM1',
          value: '10.0.51.1  www.hosts-editor.com.au\r\n10.0.51.2  api.hosts-editor.com.au\r\n',
          active: false
        },
        {
          id: uuidv4(),
          name: 'VM2',
          value: '10.0.52.1  www.hosts-editor.com.au\r\n10.0.52.2  api.hosts-editor.com.au\r\n',
          active: false
        }
      ]
    },
    {
      id: uuidv4(),
      name: 'AWS',
      entries: [
        {
          id: uuidv4(),
          name: 'Australia East',
          value: '192.168.51.1  www.hosts-editor.com.au\r\n192.168.51.2  api.hosts-editor.com.au\r\n',
          active: false
        },
        {
          id: uuidv4(),
          name: 'US West',
          value: '192.168.52.1  www.hosts-editor.com.au\r\n192.168.52.2  api.hosts-editor.com.au\r\n',
          active: false
        }
      ]
    },
    {
      id: uuidv4(),
      name: 'Azure',
      entries: [
        {
          id: uuidv4(),
          name: 'Australia East',
          value: '192.168.50.1  staging.hosts-editor.com.au\r\n',
          active: false
        },
        {
          id: uuidv4(),
          name: 'US West',
          value: '192.168.50.2  staging.hosts-editor.com.au\r\n',
          active: false
        }
      ]
    }
  ]
}

export default sampleData;
