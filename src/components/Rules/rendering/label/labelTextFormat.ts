/** The same display text must feed measurement, collision, HTML and SVG. */
export const MAP_LABEL_TEXT_DEFAULTS = {perLine:10, maxLines:3, suffix:'...'} as const;
type Segmenter = {segment:(text:string)=>Iterable<{segment:string}>};
const Constructor = (Intl as unknown as {Segmenter?:new(locale?:string,options?:{granularity:string})=>Segmenter}).Segmenter;
const segmenter = Constructor ? new Constructor(undefined,{granularity:'grapheme'}) : undefined;

export function displayCharacters(text:string):string[]{
  if(segmenter)return Array.from(segmenter.segment(text),item=>item.segment);
  const parts:string[]=[];
  for(const char of Array.from(text)){
    if(parts.length&&(/\p{Mark}|[\uFE0E\uFE0F\u200D\u{1F3FB}-\u{1F3FF}]/u.test(char)||parts[parts.length-1].endsWith('\u200D')))parts[parts.length-1]+=char;
    else parts.push(char);
  }
  return parts;
}

export function formatMapLabelText(text:string,options:{perLine?:number;maxLines?:number;suffix?:string}={}):string{
  const perLine=Number.isFinite(options.perLine)&&options.perLine!>0?Math.max(1,Math.floor(options.perLine!)):10;
  const maxLines=Number.isFinite(options.maxLines)&&options.maxLines!>0?Math.max(1,Math.floor(options.maxLines!)):3;
  const suffix=options.suffix??'...';
  const lines:string[]=[];
  for(const paragraph of text.replace(/\r\n?/g,'\n').split('\n')){
    let remaining=displayCharacters(paragraph);
    if(!remaining.length){lines.push('');continue;}
    while(remaining.length){
      let count=Math.min(perLine,remaining.length);
      if(remaining.length>perLine){
        const space=remaining.slice(0,count+1).map(char=>/\s/u.test(char)).lastIndexOf(true);
        if(space>0&&space>=Math.floor(perLine/2))count=space;
      }
      lines.push(remaining.slice(0,count).join('').trimEnd());
      remaining=remaining.slice(count);
      if(remaining[0]===' ')remaining.shift();
    }
  }
  if(lines.length<=maxLines)return lines.join('\n');
  const shown=lines.slice(0,maxLines),dots=displayCharacters(suffix).slice(0,perLine);
  shown[maxLines-1]=displayCharacters(shown[maxLines-1]).slice(0,perLine-dots.length).join('')+dots.join('');
  return shown.join('\n');
}
