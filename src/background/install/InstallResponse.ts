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


const sensorRegex: RegExp = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/
const tokenRegex: RegExp = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/

export interface InstallResponse {
    token: string
    sensor: string
    expiresAt: number
    issuedAt: number
}

export function normalizeInstallResponse(installResponse: InstallResponse): InstallResponse {
    return {
        token: installResponse.token,
        sensor: installResponse.sensor,
        expiresAt: installResponse.expiresAt,
        issuedAt: installResponse.issuedAt
    }
}

export function isInstallResponse(data: any): data is InstallResponse {
    const validToken: boolean = 'token' in data && typeof data.token === 'string' && tokenRegex.test(data.token)
    if (!validToken) {
        return false
    }

    const validSensorId: boolean = 'sensor' in data && typeof data.sensor === 'string' && sensorRegex.test(data.sensor)
    if (!validSensorId) {
        return false
    }

    const validExpiresAt: boolean = 'expiresAt' in data && typeof data.expiresAt === 'number' && Number.isInteger(data.expiresAt) && data.expiresAt >= 0
    if (!validExpiresAt) {
        return false
    }

    const validIssuedAt: boolean = 'issuedAt' in data && typeof data.issuedAt === 'number' && Number.isInteger(data.issuedAt) && data.issuedAt >= 0
    if (!validExpiresAt) {
        return false
    }

    return true
}
