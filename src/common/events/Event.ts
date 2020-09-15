// SPDX-License-Identifier: AGPL-3.0-or-later

// Copyright (C) 2020 Mitchell Wasson

// This file is part of Weaklayer Sensor.

// Weaklayer Sensor is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.


export interface Event {
    type: string
    time: number
}

export function isEvent(data: any): data is Event {
    const validType: boolean = 'type' in data && typeof data.type === 'string'
    const validTime: boolean = 'time' in data && typeof data.time === 'number' && isEventTime(data.time)

    return validType && validTime
}

export function isEventTime(num: number): boolean {
    return Number.isInteger(num) && num >= 0
}



let lastMillisAsMicros: number = 0
let tag: number = 0
export function getEventTime(): number {
    const millisAsMicros = getMillisecondTimeAsMicroseconds()
    if (millisAsMicros !== lastMillisAsMicros) {
        // reset the tag value whenever the measured time changes
        // random up to 900 so we don't end up near 1000 and roll over in the same millisecond
        lastMillisAsMicros = millisAsMicros
        tag = getRandomInt(0, 900)
    }

    return millisAsMicros + getTag()
}

function getMillisecondTimeAsMicroseconds(): number {
    // prefer to use the performance time api as it has better guarantees
    // monotonically increasing time.
    // Still can't rely on it for microsecond precision though according to docs
    let millisAsMicros = 0
    if (typeof performance !== 'undefined' && typeof performance.timeOrigin !== 'undefined') {
        millisAsMicros = Math.round(performance.timeOrigin + performance.now())
    } else {
        millisAsMicros = Date.now()
    }
    return millisAsMicros * 1000
}

// This makes it more likely that two calls in the same millisecond
// are still monotonically increasing
function getTag(): number {
    tag = tag + 1
    if (tag >= 1000) {
        tag = 0
    }
    return tag
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
