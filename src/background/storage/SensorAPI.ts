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

export interface SensorAPI {
    protocol: string
    hostname: string
    port: number
}

export function normalizeSensorAPI(api: SensorAPI): SensorAPI {
    return {
        protocol: api.protocol,
        hostname: api.hostname,
        port: api.port
    }
}

export function isSensorAPI(data: any): data is SensorAPI {
    const validProtocol: boolean = 'protocol' in data && typeof data.protocol === 'string' && (data.protocol === 'http' || data.protocol === 'https')
    if (!validProtocol) {
        return false
    }

    const validHostname: boolean = 'hostname' in data && typeof data.hostname === 'string' && data.hostname.length >= 1 && data.hostname.length <= 255
    if (!validHostname) {
        return false
    }

    const validPort: boolean = 'port' in data && typeof data.port === 'number' && data.port >= 0 && data.port <= 65535 && Number.isInteger(data.port)
    if (!validPort) {
        return false
    }

    return true
}
