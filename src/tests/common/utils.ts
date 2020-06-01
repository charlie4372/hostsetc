import { Hosts} from "@common/hosts";

/*
Strip the IDs out of the categories nd entries.
Makes assertion easier.
 */
export function stripIds(hosts: Hosts): Hosts {
  if (!hosts.categories) {
    return hosts
  }
  for (const category of hosts.categories) {
    category.id = '';

    if (category.entries) {
      for (const entry of category.entries) {
        entry.id = '';
      }
    }
  }

  return hosts;
}
