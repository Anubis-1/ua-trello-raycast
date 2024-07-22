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
  /** Trello List ID for Kirsty - Trello List ID for Kirsty */
  "listIdKirsty": string,
  /** Trello List ID for Arya - Trello List ID for Arya */
  "listIdArya": string,
  /** Trello List ID for Christine - Trello List ID for Christine */
  "listIdChristine": string,
  /** Trello List ID for Templates - Trello List ID for Web Support Team Templates */
  "templatesListId": string,
  /** Trello User ID for Anu - Your Trello User ID */
  "userIdAnu": string,
  /** Trello User ID for Arya - Your Trello User ID */
  "userIdArya": string,
  /** Trello User ID for Kirsty - Your Trello User ID */
  "userIdKirsty": string,
  /** Trello User ID for Christine - Your Trello User ID */
  "userIdChristine": string,
  /** Trello Creator ID for Anu - Your Creator ID */
  "idMemberCreator": string
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
  /** Preferences accessible in the `show-links` command */
  export type ShowLinks = ExtensionPreferences & {}
  /** Preferences accessible in the `search-trello-cards` command */
  export type SearchTrelloCards = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `arya` command */
  export type Arya = {}
  /** Arguments passed to the `christine` command */
  export type Christine = {}
  /** Arguments passed to the `kirsty` command */
  export type Kirsty = {}
  /** Arguments passed to the `show-links` command */
  export type ShowLinks = {}
  /** Arguments passed to the `search-trello-cards` command */
  export type SearchTrelloCards = {}
}


