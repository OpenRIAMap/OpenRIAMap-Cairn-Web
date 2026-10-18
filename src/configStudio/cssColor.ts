// Deterministic CSS sRGB subset: identical in Node preflight and browser.
// Context-dependent var(), currentColor and newer device colour spaces are
// intentionally excluded: exported maps must not depend on editor CSS.
const names = new Set(('aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen transparent').split(' '));
const number = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const numeric = (value: string) => number.test(value) && Number.isFinite(Number(value));
const channel = (value: string) => numeric(value.endsWith('%') ? value.slice(0,-1) : value);
export function validCssColor(input: unknown): input is string {
  if (typeof input !== 'string') return false;
  const value = input.trim().toLowerCase();
  if (names.has(value) || /^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/.test(value)) return true;
  const match = /^(rgb|rgba|hsl|hsla)\((.*)\)$/.exec(value);
  if (!match) return false;
  const comma = match[2].includes(',');
  if (comma && match[2].includes('/')) return false;
  const parts = comma ? match[2].split(',').map(part=>part.trim()) : match[2].trim().split(/\s*\/\s*/);
  const channels = comma ? parts.slice(0,3) : parts[0].split(/\s+/);
  const alpha = comma ? parts[3] : parts[1];
  if (channels.length !== 3 || parts.length > (comma ? 4 : 2) || comma && parts.length < 3 || alpha !== undefined && !channel(alpha)) return false;
  if (match[1].startsWith('rgb')) return channels.every(channel) && (!comma || channels.every(part=>part.endsWith('%')) || channels.every(part=>!part.endsWith('%')));
  const hue = channels[0].replace(/(?:deg|grad|rad|turn)$/,'');
  return numeric(hue) && channels.slice(1).every(part=>part.endsWith('%') && numeric(part.slice(0,-1)));
}
