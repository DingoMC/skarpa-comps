/**
 * @fileoverview This file contains utilties to handle colored text on console (server-only).
 * @copyright Wiline Networks 2025
 * @author Marcin Basak
 */

export enum CColor {
  Black = '0',
  DarkBlue = '1',
  DarkGreen = '2',
  Cyan = '3',
  DarkRed = '4',
  Purple = '5',
  Gold = '6',
  Gray = '7',
  DarkGray = '8',
  Blue = '9',
  Green = 'a',
  Aqua = 'b',
  Red = 'c',
  Magenta = 'd',
  Yellow = 'e',
  White = 'f',
  Reset = 'r',
}

const FG_COLOR_MAP = {
  [CColor.Black]: '\x1b[0m\x1b[30m',
  [CColor.DarkBlue]: '\x1b[0m\x1b[34m',
  [CColor.DarkGreen]: '\x1b[0m\x1b[32m',
  [CColor.Cyan]: '\x1b[0m\x1b[36m',
  [CColor.DarkRed]: '\x1b[0m\x1b[31m',
  [CColor.Purple]: '\x1b[0m\x1b[35m',
  [CColor.Gold]: '\x1b[0m\x1b[33m',
  [CColor.Gray]: '\x1b[0m\x1b[37m',
  [CColor.DarkGray]: '\x1b[1m\x1b[90m',
  [CColor.Blue]: '\x1b[1m\x1b[94m',
  [CColor.Green]: '\x1b[1m\x1b[92m',
  [CColor.Aqua]: '\x1b[1m\x1b[96m',
  [CColor.Red]: '\x1b[1m\x1b[91m',
  [CColor.Magenta]: '\x1b[1m\x1b[95m',
  [CColor.Yellow]: '\x1b[1m\x1b[93m',
  [CColor.White]: '\x1b[1m\x1b[97m',
  [CColor.Reset]: '\x1b[0m',
};

const BG_COLOR_MAP = {
  [CColor.Black]: '\x1b[0m\x1b[40m',
  [CColor.DarkBlue]: '\x1b[0m\x1b[44m',
  [CColor.DarkGreen]: '\x1b[0m\x1b[42m',
  [CColor.Cyan]: '\x1b[0m\x1b[46m',
  [CColor.DarkRed]: '\x1b[0m\x1b[41m',
  [CColor.Purple]: '\x1b[0m\x1b[45m',
  [CColor.Gold]: '\x1b[0m\x1b[43m',
  [CColor.Gray]: '\x1b[0m\x1b[47m',
  [CColor.DarkGray]: '\x1b[1m\x1b[100m',
  [CColor.Blue]: '\x1b[1m\x1b[104m',
  [CColor.Green]: '\x1b[1m\x1b[102m',
  [CColor.Aqua]: '\x1b[1m\x1b[106m',
  [CColor.Red]: '\x1b[1m\x1b[101m',
  [CColor.Magenta]: '\x1b[1m\x1b[105m',
  [CColor.Yellow]: '\x1b[1m\x1b[103m',
  [CColor.White]: '\x1b[1m\x1b[107m',
  [CColor.Reset]: '\x1b[0m',
};

export const FG_FORMATTER = '&';
export const BG_FORMATTER = '^';

/**
 * Use it instead of `&` character to prevent color formatting.
 */
export const C_AMP = '*#amp*#';
/**
 * Use it instead of `^` character to prevent color formatting.
 */
export const C_WDG = '*#wdg*#';

export const C_MIDWR = '&8[&bMidwr&8]';
export const C_AXIOS = '&8[&aAxios&8]';
export const C_WEBHOOK = '&8[&eWebhk&8]';
export const C_CALL = '&8[&dCALL&8]';
export const C_ACK = '&8[&aACK&8]';
export const C_FWD = '&8[&7FWD&8]';
export const C_REQ = '&6-REQ-?';
export const C_BLK = '&4-BLK-|';
export const C_RDR = '&5-RDR->';
export const C_ACC = '&2-ACC->';
export const C_MDFWD = '&7-FWD->';

export class CConsole {
  public static formatted(formattedText: string) {
    let t = formattedText;
    if (!t.endsWith(`${FG_FORMATTER}r`) && !t.endsWith(`${BG_FORMATTER}r`)) t += '&r';
    for (const [k, v] of Object.entries(BG_COLOR_MAP)) {
      const find = `${BG_FORMATTER}${k}`;
      t = t.replaceAll(find, v);
    }
    for (const [k, v] of Object.entries(FG_COLOR_MAP)) {
      const find = `${FG_FORMATTER}${k}`;
      t = t.replaceAll(find, v);
    }
    // Keep non-formatted characters
    t = t.replaceAll(C_AMP, '&');
    t = t.replaceAll(C_WDG, '^');
    return t;
  }

  public static formatText(plainText: string, color: CColor = CColor.White, background: CColor = CColor.Black) {
    return `${BG_COLOR_MAP[background]}${FG_COLOR_MAP[color]}${plainText}${FG_COLOR_MAP[CColor.Reset]}`;
  }

  public static timestamp() {
    const date = new Date();
    const y = date.getUTCFullYear();
    const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    const h = String(date.getUTCHours()).padStart(2, '0');
    const m = String(date.getUTCMinutes()).padStart(2, '0');
    const s = String(date.getUTCSeconds()).padStart(2, '0');
    const ms = String(date.getUTCMilliseconds()).padStart(3, '0');
    const timeStr = `${y}-${mo}-${d}, ${h}:${m}:${s}.${ms}`;
    return `&8[&7${timeStr}&8]`;
  }

  public static displayF(formattedText: string) {
    console.log(CConsole.formatted(formattedText));
  }

  public static display(plainText: string, color: CColor = CColor.White, background: CColor = CColor.Black) {
    console.log(CConsole.formatText(plainText, color, background));
  }
}
