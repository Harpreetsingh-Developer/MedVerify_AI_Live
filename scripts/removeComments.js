const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const INCLUDE_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx', '.css']);
const EXCLUDE_DIRS = new Set(['node_modules', '.next', 'dist', 'out', 'build']);

function stripCommentsFromCode(code, ext) {

    if (ext === '.css') {
        return code.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    const result = [];
    const length = code.length;
    let i = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let inTemplate = false;
    let inRegex = false;
    let inBlockComment = false;
    let inLineComment = false;
    let templateDepth = 0;

    function isEscaped(idx) {
        let backslashes = 0;
        let j = idx - 1;
        while (j >= 0 && code[j] === '\\') {
            backslashes += 1;
            j -= 1;
        }
        return backslashes % 2 === 1;
    }

    while (i < length) {
        const ch = code[i];
        const next = i + 1 < length ? code[i + 1] : '';

        if (inLineComment) {
            if (ch === '\n' || ch === '\r') {
                inLineComment = false;
                result.push(ch);
            }
            i += 1;
            continue;
        }

        if (inBlockComment) {
            if (ch === '*' && next === '/') {
                inBlockComment = false;
                i += 2;
            } else {
                i += 1;
            }
            continue;
        }

        if (inSingleQuote) {
            result.push(ch);
            if (ch === '\'' && !isEscaped(i)) inSingleQuote = false;
            i += 1;
            continue;
        }

        if (inDoubleQuote) {
            result.push(ch);
            if (ch === '"' && !isEscaped(i)) inDoubleQuote = false;
            i += 1;
            continue;
        }

        if (inTemplate) {
            result.push(ch);
            if (ch === '`' && !isEscaped(i) && templateDepth === 0) {
                inTemplate = false;
            } else if (ch === '{' && code[i - 1] === '$') {
                templateDepth += 1;
            } else if (ch === '}' && templateDepth > 0) {
                templateDepth -= 1;
            }
            i += 1;
            continue;
        }

        if (inRegex) {
            result.push(ch);
            if (ch === '/' && !isEscaped(i)) inRegex = false;
            i += 1;
            continue;
        }

        if (ch === '/' && next === '/') {
            inLineComment = true;
            i += 2;
            continue;
        }
        if (ch === '/' && next === '*') {
            inBlockComment = true;
            i += 2;
            continue;
        }

        if (ch === '\'') { inSingleQuote = true;
            result.push(ch);
            i += 1; continue; }
        if (ch === '"') { inDoubleQuote = true;
            result.push(ch);
            i += 1; continue; }
        if (ch === '`') { inTemplate = true;
            templateDepth = 0;
            result.push(ch);
            i += 1; continue; }


        if (ch === '/') {
            const prev = result.length ? result[result.length - 1] : '';
            if (!prev || /[\s\(\{\[;,=:!+\-*?]/.test(prev)) {

                inRegex = true;
                result.push(ch);
                i += 1;
                continue;
            }
        }

        result.push(ch);
        i += 1;
    }


    return result.join('').replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, '');
}

function shouldProcess(filePath) {
    const ext = path.extname(filePath);
    if (!INCLUDE_EXTS.has(ext)) return false;
    const rel = path.relative(ROOT, filePath).split(path.sep);
    return !rel.some((part) => EXCLUDE_DIRS.has(part));
}

function walk(dir, files = []) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (EXCLUDE_DIRS.has(entry.name)) continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full, files);
        else files.push(full);
    }
    return files;
}

function main() {
    const allFiles = walk(ROOT);
    const candidates = allFiles.filter(shouldProcess);
    let changed = 0;
    for (const file of candidates) {
        const ext = path.extname(file);
        const before = fs.readFileSync(file, 'utf8');
        const after = stripCommentsFromCode(before, ext);
        if (after !== before) {
            fs.writeFileSync(file, after, 'utf8');
            changed += 1;
        }
    }
    console.log(`Processed ${candidates.length} files, modified ${changed}.`);
}

if (require.main === module) {
    main();
}