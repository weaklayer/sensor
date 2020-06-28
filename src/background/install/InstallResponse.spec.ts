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
import { InstallResponse, isInstallResponse, normalizeInstallResponse } from './InstallResponse';

suite('InstallResponse', () => {

    test('Valid install response', async () => {
        const installResponse = {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
            sensor: "68886d61-572b-41a5-8edd-93a564fb5ba3",
            expiresAt: 52435234,
            issuedAt: 412341,
            extra: "gsdfgs"
        }

        assert.isTrue(isInstallResponse(installResponse), "Valid install response identified as invalid")

        const normalizedInstallResponse: InstallResponse = normalizeInstallResponse(installResponse)
        assert.isTrue(isInstallResponse(normalizedInstallResponse), "Valid install response identified as invalid")
        assert.isFalse('extra' in normalizedInstallResponse, "Install response normalization failed")
    })

})
