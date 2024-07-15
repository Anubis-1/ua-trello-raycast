/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Trello API Key - Trello API Key */
  "apiKey": string,
  /** Trello API Token - Trello Token */
  "apiToken": string,
  /** Trello List ID for Arya - Trello Board ID for Arya */
  "boardIdArya": string,
  /** Trello List ID for Christine - Trello List ID for Christine */
  "boardIdChristine": string,
  /** Trello List ID for Kirsty - Trello List ID for Kirsty */
  "listIdKirsty": string,
  /** Trello List ID for Arya - Trello List ID for Arya */
  "listIdArya": string,
  /** Trello User ID for Christine - Trello User ID for Christine */
  "userIdChristine": string,
  /** Trello User ID for Kirsty - Trello User ID for Kirsty */
  "userIdKirsty": string,
  /** Trello User ID for Anu - Trello User ID for Anu */
  "UserIdAnu": string,
  /** Trello User ID for Arya - Trello User ID for Arya */
  "userIdArya": string,
  /** Web Support Team Templates - Web Support Team Teamplates */
  "templatesListId": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `arya` command */
  export type Arya = ExtensionPreferences & {}
  /** Preferences accessible in the `christine` command */
  export type Christine = ExtensionPreferences & {}
  /** Preferences accessible in the `kirsty` command */
  export type Kirsty = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `arya` command */
  export type Arya = {}
  /** Arguments passed to the `christine` command */
  export type Christine = {}
  /** Arguments passed to the `kirsty` command */
  export type Kirsty = {}
}


