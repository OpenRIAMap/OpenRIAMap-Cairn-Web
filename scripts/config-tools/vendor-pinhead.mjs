import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root = path.resolve(import.meta.dirname, '../..');
const out = path.join(root, 'public/icons/pinhead/v25');
const manifestPath = path.join(root, 'src/configStudio/pinhead-manifest.generated.json');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
if (process.argv.includes('--check')) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  for (const [id, hash] of Object.entries(manifest.files)) {
    if (sha(fs.readFileSync(path.join(out, id + '.svg'))) !== hash) throw Error('Pinhead asset changed: ' + id);
  }
  if (sha(fs.readFileSync(path.join(out, 'catalogue.json'))) !== manifest.catalogueSha256) throw Error('Pinhead catalogue changed');
  if (sha(fs.readFileSync(path.join(out, 'categories.json'))) !== manifest.categoriesSha256) throw Error('Pinhead categories changed');
  const {manifestSha256,...data}=manifest;if(sha(JSON.stringify(data))!==manifestSha256)throw Error('Pinhead manifest digest changed');
  const capabilities=JSON.parse(fs.readFileSync(path.join(root,'src/configStudio/pinhead-capabilities.generated.json'),'utf8'));if(capabilities.manifestSha256!==manifestSha256||JSON.stringify(capabilities.ids)!==JSON.stringify(Object.keys(manifest.files)))throw Error('Pinhead capability list changed');
  console.log(`Pinhead v25: ${Object.keys(manifest.files).length} pinned SVGs verified.`);
} else {
  const source = process.argv[2], categoriesFile = process.argv[3];
  if (!source || !categoriesFile) throw Error('Usage: vendor-pinhead.mjs extracted-package categories.json');
  const complete = JSON.parse(fs.readFileSync(path.join(source, 'dist/icons/index.complete.json'), 'utf8'));
  if (complete.version !== '15.25.0') throw Error('Expected pinned package 15.25.0');
  fs.mkdirSync(out, { recursive: true });
  const categoryNames = { transportation: '交通', transport: '交通', natural: '自然', nature: '自然', facilities: '公共设施', amenities: '公共设施', infrastructure: '基础设施', buildings: '建筑', structures: '建筑', recreation: '旅游休闲', sports: '运动', food: '餐饮', commerce: '商业', abstract_symbols: '符号', people: '人物', animals: '动物', plants: '植物', geography: '地理', religion: '文化宗教', objects: '物品', vehicles: '交通工具' };
  Object.assign(categoryNames, {signage:'标志标牌',other:'其他',underground:'地下设施',towers_poles_masts:'塔与杆柱',boundaries:'边界',cartoon_style:'卡通图形',microbiology:'微生物',body_parts:'身体与医疗',hand_tools:'工具',food_and_drink:'餐饮',things_in_slots:'插口与容器',bags:'包袋',barriers:'路障',bear_spray_cans:'防护用品',benches:'座椅',clothing:'服饰',books:'书籍',landforms:'地形地貌',fuel_stations:'加油站',furniture:'家具',medical_devices_and_medicine:'医疗',ways:'交通道路',landmarks:'地标景点',dice:'骰子',digital_totems:'数字终端',parking:'停车',envelopes:'邮件',manhole_covers:'井盖',mobile_phones:'手机',passports:'证件',phones:'电话',pin_pads:'键盘',pixel_style:'像素图形',tags:'标签',terminal_screens:'终端屏幕',utility_devices:'公用设施',vending_machines:'售卖机',water_pipes:'供水管道'});
  // Project-maintained search vocabulary. Unknown words retain their English ID.
  const words = { airport: '机场', terminal: '航站楼', plane: '飞机', airplane: '飞机', train: '火车 铁路', railway: '铁路', rail: '铁路', locomotive: '机车', tram: '有轨电车', bus: '公交 巴士', station: '车站', stop: '站点', platform: '站台', ferry: '渡轮', ship: '船', boat: '船', port: '港口', anchor: '锚 港口', mountain: '山 山脉', tree: '树木', trees: '树林', pine: '松树', leaf: '叶子', flower: '花', forest: '森林', water: '水', waterfall: '瀑布', river: '河流', lake: '湖泊', beach: '海滩', park: '公园', playground: '游乐园', amusement: '游乐', wheel: '轮', building: '建筑', house: '住宅 房屋', hospital: '医院', school: '学校', book: '书 图书馆', library: '图书馆', shop: '商店', shopping: '购物', bag: '购物袋', restaurant: '餐厅', fork: '餐饮', spoon: '餐饮', knife: '餐饮', coffee: '咖啡', cup: '杯子', hotel: '酒店', bed: '住宿', camp: '营地', tent: '帐篷', parking: '停车场', car: '汽车', bicycle: '自行车', road: '道路', bridge: '桥梁', tunnel: '隧道', toilet: '卫生间', restroom: '卫生间', wc: '卫生间', information: '信息 问询', museum: '博物馆', monument: '纪念碑', cinema: '影院', theater: '剧院', castle: '城堡', tower: '塔', flag: '旗帜', star: '星 景点', electricity: '电力', bolt: '电力 闪电', bank: '银行', atm: '自动取款机', post: '邮政', envelope: '邮件', fuel: '加油站', fire: '消防 火', police: '警察', wheelchair: '无障碍', dog: '狗', cat: '猫', fish: '鱼', sports: '运动', swimming: '游泳', pool: '泳池', tennis: '网球', football: '足球', basketball: '篮球', train_station: '铁路车站', ferris_wheel: '摩天轮 游乐园' };
  Object.assign(words,{airliner:'飞机 民航 客机 机场',jet:'飞机 喷气式',helipad:'直升机 停机坪',helicopter:'直升机',railroad:'铁路',taxi:'出租车',gondola:'缆车',ski:'滑雪',church:'教堂',cross:'十字 医疗 宗教',temple:'寺庙',mosque:'清真寺',pagoda:'佛塔',stadium:'体育场',lighthouse:'灯塔',office:'办公',city:'城市',shopfront:'商铺',elevator:'电梯',stairs:'楼梯',escalator:'自动扶梯',hiking:'徒步',picnic:'野餐',watercraft:'水上交通',conifer:'针叶树',deciduous:'阔叶树',spruce:'云杉',fir:'冷杉',oak:'橡树',palm:'棕榈',sequoia:'杉树',peak:'山峰',hill:'丘陵',island:'岛屿',cave:'洞穴'});
  const rows = [], files = {};
  for (const [id, entry] of Object.entries(complete.icons)) {
    if (!/^[a-z0-9_]+$/.test(id)) throw Error('Unexpected icon ID ' + id);
    const svg = fs.readFileSync(path.join(source, 'dist/icons', id + '.svg'));
    if (!/^<svg[^>]+viewBox="0 0 15 15"[^>]*>\s*<path d="[Mm0-9., A-Za-z+\-]+"\s*\/>\s*<\/svg>\s*$/.test(svg.toString())) throw Error('Unexpected SVG structure ' + id);
    fs.writeFileSync(path.join(out, id + '.svg'), svg);
    files[id] = sha(svg);
    const directory = entry.srcdir?.split('/')[0] || 'other';
    const tokens = id.split('_');
    const translated = [...new Set([words[id], ...tokens.map(token => words[token])].filter(Boolean))];
    const category = categoryNames[directory] || directory.replaceAll('_', ' ');
    rows.push({ id, name: translated[0] || id.replaceAll('_', ' '), category, directory: entry.srcdir || 'other', keywords: translated.join(' '), ...(entry.sensitive ? { sensitive: entry.sensitive } : {}) });
  }
  const catalogue = JSON.stringify({ version: '25', packageVersion: '15.25.0', icons: rows });
  fs.writeFileSync(path.join(out, 'catalogue.json'), catalogue);
  fs.copyFileSync(path.join(source, 'LICENSE'), path.join(out, 'LICENSE.txt'));
  fs.copyFileSync(categoriesFile, path.join(out, 'categories.json'));
  const data = { library: 'pinhead', version: '25', packageVersion: '15.25.0', license: 'CC0-1.0', source: 'https://github.com/waysidemapping/pinhead', catalogueSha256: sha(catalogue), categoriesSha256: sha(fs.readFileSync(categoriesFile)), files };
  const manifestSha256 = sha(JSON.stringify(data));
  fs.writeFileSync(manifestPath, JSON.stringify({ ...data, manifestSha256 }, null, 2) + '\n');
  fs.writeFileSync(path.join(root,'src/configStudio/pinhead-capabilities.generated.json'),JSON.stringify({library:'pinhead',version:'25',manifestSha256,ids:Object.keys(files)})+'\n');
  console.log(`Vendored ${rows.length} Pinhead SVGs, manifest ${manifestSha256}.`);
}
