// scripts/convert-postal.js
import xlsx from 'xlsx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// 現在のファイルのディレクトリを取得
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Excel ファイルを読み込む
const workbook = xlsx.readFile(path.join(__dirname, '../data/000925835.xlsx'))
const sheet = workbook.Sheets[workbook.SheetNames[0]]

// JSON にパース
const rows = xlsx.utils.sheet_to_json(sheet, {
  header: ['', 'prefecture', 'city'],
  defval: '',
  range: 2,
})

// 空文字キーを除去
const cleanRows = rows.map(({ ['']: _, ...rest }) => rest);

// JSON ファイルとして書き出し
const outputPath = path.join(__dirname, '../data/000925835.json')
fs.writeFileSync(outputPath, JSON.stringify(cleanRows, null, 2), 'utf-8')

console.log(`✅ ${outputPath} を出力しました`)