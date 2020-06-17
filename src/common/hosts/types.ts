/*
The hosts entity.
This is a representation of a hosts file.
 */
export interface Hosts {
  /*
  The categories.
  There will always be at least one.
   */
  categories: HostsCategory[];
}

/*
The category entity.
 */
export interface HostsCategory {
  /*
  The ID.
  Uniquely identifies this category.
  This only exists at run time and is not persisted.
   */
  id: string;

  /*
  The name.
   */
  name: string;

  /*
  The entries.
  There will always be at least one.
   */
  entries: HostsEntry[];
}

/*
The entry entity.
 */
export interface HostsEntry {
  /*
  The ID.
  Uniquely identifies this category.
  This only exists at run time and is not persisted.
   */
  id: string;

  /*
  The name.
   */
  name: string;

  /*
  The content.
  This holds the comments, ip addresses and domains of the host file.
   */
  content: string;

  /*
  The active flag.
  When active, this entity will be active in the hosts file.
  When not active, this entity will be commented out in the hosts file.
   */
  active: boolean;
}
