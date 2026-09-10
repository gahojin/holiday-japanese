# holiday-japanese

日本の祝日/休日判定ユーティリティ

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![NPM Version](https://img.shields.io/npm/v/%40gahojin-inc%2Fholiday-japanese?activeTab=versions)](https://www.npmjs.com/package/@gahojin-inc/holiday-japanese)


## 使い方
 
```shell
npm install @gahojin-inc/holiday-japanese
```

```ts
import { between, isHoliday } from '@gahojin-inc/holiday-japanese'
 
isHoliday(new Date(2024, 9, 14))
//=> true (スポーツの日)
 
between(new Date(2025, 0, 1), new Date(2025, 0, 31))
//=> [
//   { date: Wed Jan 01 2025 00:00:00, nameJa: '元日', nameEn: "New Year's Day" },
//   { date: Mon Jan 13 2025 00:00:00, nameJa: '成人の日', nameEn: 'Coming of Age Day' },
// ]
```

## API
 
### `isHoliday(date: Date): boolean`
 
指定した日が祝日(振替休日を含む)かどうかを判定する。
 
### `between(start: Date, end: Date): Holiday[]`
 
指定した期間(両端を含む)に含まれる祝日を、日付の昇順で返す。
 
```ts
type Holiday = {
  date: Date
  nameJa: string // 祝日名(日本語)
  nameEn: string // 祝日名(英語)
}
```

## パフォーマンス

### Environment

- Device: Mac mini (M4, 10-core)
- Memory: 32 GB
- OS: macOS 26.6.2
- Node.js: v26.8.1
- Vitest: 5.0.0

*** isHoliday ***

| name | hz | mean (ms) | p99 (ms) | rme |
|---|---|---|---|---|
| holiday-japanese | 6,442,138.70 | 0.0002 | 0.0002 | ±0.31% |
| holiday_jp | 30,275.16 | 0.0331 | 0.0376 | ±0.06% |
| japanese-holidays | 2,791,353.89 | 0.0004 | 0.0005 | ±0.42% |

*** between (1 year) ***

| name | hz | mean (ms) | p99 (ms) | rme |
|---|---|---|---|---|
| holiday-japanese | 999,792.18 | 0.0010 | 0.0012 | ±0.08% |
| holiday_jp | 3,073.43 | 0.3256 | 0.3528 | ±0.07% |
| japanese-holidays | 815,277.09 | 0.0012 | 0.0015 | ±0.08% |

*** between (10 years) ***

| name | hz | mean (ms) | p99 (ms) | rme |
|---|---|---|---|---|
| holiday-japanese | 63,273.04 | 0.0159 | 0.0182 | ±0.09% |
| holiday_jp | 2,919.95 | 0.3427 | 0.3645 | ±0.07% |
| japanese-holidays | 68,803.00 | 0.0146 | 0.0157 | ±0.07% |


## データセット

祝日のデータセットに、holiday_jp (https://github.com/holiday-jp/holiday_jp) を使用しています。


## ライセンス

[Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

```
Copyright 2024, GAHOJIN, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
