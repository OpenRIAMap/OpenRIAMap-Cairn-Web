import ts from 'typescript';
import fs from 'node:fs';
import assert from 'node:assert/strict';

/** Mirrors the existing native contract generator; metadata never changes the contract. */
export function contractModel() {
  const file = 'src/configStudio/types.ts';
  const program = ts.createProgram([file], { strict: true, target: ts.ScriptTarget.ES2020 });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(file);
  const root = source.statements.find(s => ts.isTypeAliasDeclaration(s) && s.name.text === 'ConfigPackageV3');
  const definitions = {}, metadata = {}, known = new Map();
  function schema(type, usage = '$') {
    if (type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) return {};
    if (type.flags & ts.TypeFlags.Undefined) return { type: 'undefined' };
    if (type.flags & ts.TypeFlags.Null) return { type: 'null' };
    if (type.isStringLiteral() || type.isNumberLiteral()) return { const: type.value };
    if (type.flags & ts.TypeFlags.BooleanLiteral) return { const: checker.typeToString(type) === 'true' };
    if (type.flags & ts.TypeFlags.String) return { type: 'string' };
    if (type.flags & ts.TypeFlags.Number) return { type: 'number' };
    if (type.flags & ts.TypeFlags.Boolean) return { type: 'boolean' };
    if (type.isUnion()) return { anyOf: type.types.filter(t => !(t.flags & ts.TypeFlags.Undefined)).map(t => schema(t, usage)) };
    if (checker.isTupleType(type)) return { type: 'array', tuple: checker.getTypeArguments(type).map((t, i) => schema(t, `${usage}[${i}]`)) };
    if (checker.isArrayType(type)) return { type: 'array', items: schema(checker.getTypeArguments(type)[0], `${usage}[]`) };
    if (known.has(type)) return { ref: known.get(type) };
    const id = `t${known.size}`; known.set(type, id);
    const alias = type.aliasSymbol?.getName(), symbol = type.getSymbol()?.getName();
    const name = [alias, symbol].find(x => x && !x.startsWith('__')) ?? usage;
    metadata[id] = { id, name, usage, properties: {} };
    const properties = {}, required = [];
    for (const property of checker.getPropertiesOfType(type)) {
      const declaration = property.valueDeclaration ?? property.declarations?.[0] ?? source;
      properties[property.name] = schema(checker.getTypeOfSymbolAtLocation(property, declaration), `${usage}.${property.name}`);
      if (!(property.flags & ts.SymbolFlags.Optional)) required.push(property.name);
      const origin = declaration.getSourceFile();
      metadata[id].properties[property.name] = {
        comment: ts.displayPartsToString(property.getDocumentationComment(checker)),
        deprecated: property.getJsDocTags().some(tag => tag.name === 'deprecated'),
        source: origin.fileName.replaceAll('\\', '/').replace(/^.*?src\//, 'src/'),
        line: origin.getLineAndCharacterOfPosition(declaration.getStart()).line + 1,
      };
    }
    const index = type.getStringIndexType();
    definitions[id] = { type: 'object', properties, required, ...(index ? { additionalProperties: schema(index, `${usage}.{自定义键}`) } : {}) };
    return { ref: id };
  }
  const contract = { root: schema(checker.getTypeFromTypeNode(root.type)), definitions };
  assert.deepEqual(contract, JSON.parse(fs.readFileSync('src/configStudio/native-contract-schema.generated.json', 'utf8')), 'Handbook must match the actual generated native contract');
  return { ...contract, metadata };
}

export function lineIndex(raw) {
  const source = ts.parseJsonText('current-full.config.json', raw), result = {};
  const root = source.statements[0].expression;
  const visit = (node, path) => {
    const start = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
    const end = source.getLineAndCharacterOfPosition(node.end).line + 1;
    result[path] = { start, end, offset: node.getStart(source), endOffset: node.end };
    if (ts.isObjectLiteralExpression(node)) for (const property of node.properties) if (ts.isPropertyAssignment(property)) visit(property.initializer, `${path}/${property.name.text.replaceAll('~', '~0').replaceAll('/', '~1')}`);
    if (ts.isArrayLiteralExpression(node)) node.elements.forEach((child, i) => visit(child, `${path}/${i}`));
  };
  visit(root, '');
  return result;
}

export function collectExamples(model, config, lines) {
  const samples = {}, seenProperties = new Set();
  function matches(schema, value, depth = 0) {
    if (depth > 40) return true;
    if (schema.ref) return matches(model.definitions[schema.ref], value, depth + 1);
    if (schema.anyOf) return schema.anyOf.some(s => matches(s, value, depth + 1));
    if ('const' in schema) return schema.const === value;
    if (!schema.type) return true;
    if (schema.type === 'array') return Array.isArray(value) && (!schema.tuple || schema.tuple.length === value.length);
    if (schema.type === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value)
      && schema.required.every(k => Object.hasOwn(value, k))
      && Object.entries(schema.properties).every(([k, s]) => !Object.hasOwn(value, k) || matches(s, value[k], depth + 1));
    return schema.type === 'null' ? value === null : typeof value === schema.type;
  }
  const walk = (schema, value, path) => {
    if (schema.ref) {
      const sample = samples[schema.ref] ??= { path, ...lines[path], properties: {}, occurrences: 0 };
      sample.occurrences++;
      for (const key of Object.keys(model.definitions[schema.ref].properties)) if (Object.hasOwn(value, key)) {
        const at = `${path}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
        sample.properties[key] ??= { path: at, ...lines[at], value: value[key] };
      }
      return walk(model.definitions[schema.ref], value, path);
    }
    if (schema.anyOf) {
      const candidates = schema.anyOf.filter(s => matches(s, value));
      assert.ok(candidates.length, `No native schema branch for ${path}`);
      candidates.forEach(s => walk(s, value, path)); return;
    }
    if (schema.type === 'array' && Array.isArray(value)) value.forEach((child, i) => walk(schema.tuple?.[i] ?? schema.items ?? {}, child, `${path}/${i}`));
    if (schema.type === 'object' && value && typeof value === 'object') {
      for (const [key, child] of Object.entries(value)) {
        const at = `${path}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
        if (schema.properties[key]) seenProperties.add(key);
        assert.ok(schema.properties[key] || schema.additionalProperties, `Undocumented property ${at}`);
        walk(schema.properties[key] ?? schema.additionalProperties, child, at);
      }
    }
  };
  walk(model.root, config, '');
  return { samples, seenProperties: [...seenProperties].sort() };
}
