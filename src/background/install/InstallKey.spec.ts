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
import { test, suite } from 'mocha';
import { InstallKey, isInstallKey, normalizeInstallKey, isChecksumValid } from './InstallKey';
import { JSDOM } from 'jsdom'

suite('InstallKey', () => {

    test('Valid install key', async () => {
        const fakeDom = new JSDOM()

        const key = {
            group: "68886d61-572b-41a5-8edd-93a564fb5ba3",
            secret: "jTbup3jD+nWFRw2LW5k6v0dP+qf6cWXsc3IazN39GnaMeKEp13kpyh6AJFo3V1ckeD3dt0JXfoqmeOWr2jU29Q==",
            checksum: "jvqWXRmh9JAnbwDS19W59lOJXD2dZuRglhFtsJzDedU=",
            extra: "heyyy"
        }

        assert.isTrue(isInstallKey(key), "Valid install key identified as invalid")

        const normalizedInstallKey: InstallKey = normalizeInstallKey(key)
        assert.isTrue(isInstallKey(normalizedInstallKey), "Valid install key identified as invalid")
        assert.isFalse('extra' in normalizedInstallKey, "Install key normalization failed")

    })
})
