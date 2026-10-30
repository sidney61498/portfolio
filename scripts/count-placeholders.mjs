// Lists every `[...]` placeholder left in the site content. Exit code 1 while any remain.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Placeholders start with a letter, so array literals like ['a', 'b'] never match.
const PATTERN = /\[[A-Za-z][^\]\n]*\]/g
const roots = ['src/content']
let total = 0

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path)
    else if (/\.tsx?$/.test(name)) scan(path)
  }
}

function scan(path) {
  readFileSync(path, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      for (const match of line.matchAll(PATTERN)) {
        total++
        console.log(`${path}:${i + 1}  ${match[0]}`)
      }
    })
}

roots.forEach(walk)
console.log(`\n${total} placeholder(s) left`)
process.exitCode = total > 0 ? 1 : 0
