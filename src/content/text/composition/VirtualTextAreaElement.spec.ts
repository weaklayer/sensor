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

import { assert } from 'chai'
import { test, suite } from 'mocha'
import { VirtualTextAreaElement } from './VirtualTextAreaElement'

suite('VirtualTExtAreaElement', () => {

    test('Constructs string with no edits', () => {
        const element = new VirtualTextAreaElement()

        const target: string = 'hello'

        element.keyboard({ type: 'keydown', key: 'h', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'e', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'o', ctrlKey: false } as KeyboardEvent)

        assert.strictEqual(element.value(), target)
    })

    test('Handles backspace', () => {
        const element = new VirtualTextAreaElement()

        const target: string = 'hllo'

        element.keyboard({ type: 'keydown', key: 'h', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'e', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'Backspace', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'o', ctrlKey: false } as KeyboardEvent)

        assert.strictEqual(element.value(), target)
    })


    test('Handles cursor shifting', () => {
        const element = new VirtualTextAreaElement()

        const target: string = 'heoll!'

        element.keyboard({ type: 'keydown', key: 'h', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'e', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'ArrowLeft', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'ArrowLeft', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'o', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'ArrowRight', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'ArrowRight', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: '!', ctrlKey: false } as KeyboardEvent)

        assert.strictEqual(element.value(), target)
    })


    test('Backspace near start and cursor moving', () => {
        const element = new VirtualTextAreaElement()

        const target: string = 'mo'

        element.keyboard({ type: 'keydown', key: 'h', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'Backspace', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'm', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'l', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'o', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'ArrowLeft', ctrlKey: false } as KeyboardEvent)
        element.keyboard({ type: 'keydown', key: 'Backspace', ctrlKey: false } as KeyboardEvent)

        assert.strictEqual(element.value(), target)
    })
})
