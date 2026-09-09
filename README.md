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

**isHoliday**
 
| name | hz | mean (ms) | p99 (ms) | rme |
| --- | --- | --- | --- | --- |
| holiday-japanese | 6,314,857.44 | 0.0002 | 0.0002 | ±0.30% |
| holiday_jp | 29,642.66 | 0.0346 | 0.0732 | ±0.59% |
| japanese-holidays | 2,782,526.41 | 0.0004 | 0.0005 | ±0.08% |
 
**between (1 year)**
 
| name | hz | mean (ms) | p99 (ms) | rme |
| --- | --- | --- | --- | --- |
| holiday-japanese | 1,002,774.68 | 0.0010 | 0.0012 | ±0.08% |
| holiday_jp | 3,039.62 | 0.3308 | 0.4082 | ±0.30% |
| japanese-holidays | 930,743.92 | 0.0011 | 0.0013 | ±0.09% |
 
**between (10 years)**
 
| name | hz | mean (ms) | p99 (ms) | rme |
| --- | --- | --- | --- | --- |
| holiday-japanese | 63,266.00 | 0.0159 | 0.0186 | ±0.09% |
| holiday_jp | 2,901.28 | 0.3451 | 0.3776 | ±0.12% |
| japanese-holidays | 78,566.98 | 0.0129 | 0.0154 | ±0.12% |


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
