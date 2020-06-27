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

export function getEventTime(): number {
    // fill in the micros with noise since Date.now() only gives millis
    return Date.now() * 1000 + generateTag()
}

function generateTag(): number {
    return getRandomInt(0, 999) // [0, 999]
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
