# holiday-japanese

日本の祝日判定ユーティリティ

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

- `isHoliday`: 本実装(holiday-japanese)はjapanese-holidaysの約2.1倍、holiday_jpの約190倍
- `between`: 本実装(holiday-japanese)はjapanese-holidaysよりやや低速(1.38倍遅い)、holiday_jpとの比較では約216倍

**isHoliday**
 
| name | hz | mean (ms) | p99 (ms) | rme |
| --- | --- | --- | --- | --- |
| holiday-japanese | 5,723,603.12 | 0.0002 | 0.0002 | ±0.41% |
| holiday_jp | 30,008.23 | 0.0333 | 0.0387 | ±0.20% |
| japanese-holidays | 2,720,609.62 | 0.0004 | 0.0005 | ±0.12% |
 

**between**
 
| name | hz | mean (ms) | p99 (ms) | rme |
| --- | --- | --- | --- | --- |
| holiday-japanese | 655,844.48 | 0.0015 | 0.0019 | ±0.15% |
| holiday_jp | 3,029.00 | 0.3301 | 0.3893 | ±0.20% |
| japanese-holidays | 906,827.18 | 0.0011 | 0.0013 | ±0.14% |
 

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
