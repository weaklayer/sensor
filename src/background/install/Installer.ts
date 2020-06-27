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

import { LocalStorage } from '../storage/LocalStorage'
import { InstallRequest } from './InstallRequest'
import { InstallResponse, isInstallResponse, normalizeInstallResponse } from './InstallResponse'
import { Lock } from '../../common/concurrent/Lock'
import { ManagedStorage } from '../storage/ManagedStorage'

export class Installer {

    private readonly lock: Lock = new Lock()

    private installInfo: InstallResponse | undefined = undefined

    // By initializing this to true, we (re)install on restart.
    // This is good because we will execute a reinstall
    // and get a new identity if the install key changes
    // And we'll keep expiring tokens at bay
    private installRequired: boolean = true

    async getAuthorizationToken(): Promise<string> {
        const info = await this.getInstallInfo()
        return info.token
    }

    // In theory this should get called
    // if the managed storage stuff changes
    // for example, new install key or sensor label
    // doesn't throw out the current info. 
    // gets us to reinstall
    forceReinstall(): void {
        this.installRequired = true
    }

    private static installInfoExpiryApproaching(installInfo: InstallResponse): boolean {
        // We should attempt to renew the token if the token is 3/4 expired
        const threeQuartersExpiredPoint = 0.25 * installInfo.issuedAt + 0.75 * installInfo.expiresAt

        return (Date.now() * 1000) > threeQuartersExpiredPoint
    }


    // Here we have the logic for the conditions where the in memory value
    // is return. If we are not in that situation, then we need the lock
    // so we can perform the storage and network actions to get a valid
    // identity back into memory here.
    private async getInstallInfo(): Promise<InstallResponse> {
        if (this.installInfo && !this.installRequired) {
            if (!Installer.installInfoExpiryApproaching(this.installInfo)) {
                return this.installInfo
            }
        }

        return this.lock.syncExecute(() => this.getInstallInfoUnsafe())
    }

    private async getInstallInfoUnsafe(): Promise<InstallResponse> {

        // check if install info in memory
        //   - if not in memory, try to fetch from storage
        //   - update memory value if something retrieved from storage
        if (!this.installInfo) {
            try {
                const storageInfo = await LocalStorage.getInstallInfo()
                this.installInfo = storageInfo
            } catch (e) {
                console.info('Could not retrieve install info from storage. Proceeding with new install.', e)
            }
        }

        // check if the in-memory value is valid
        //   - if valid, return the token
        //   - if not valid, or still not present then perform install
        if (this.installInfo && !this.installRequired) {
            if (!Installer.installInfoExpiryApproaching(this.installInfo)) {
                return this.installInfo
            }
        }

        // Install info is either not present or expired
        // Get the install response from the backend
        //   - write the new repsonse to storage
        //   - copy new response into memory
        console.info('Executing sensor install.')
        const newInstallInfo = await Installer.renewAuthorizationTokenUnsafe(this.installInfo)
        this.installRequired = false

        await LocalStorage.setInstallInfo(newInstallInfo)
        this.installInfo = newInstallInfo

        return newInstallInfo
    }

    private static async renewAuthorizationTokenUnsafe(currentInfo?: InstallResponse): Promise<InstallResponse> {

        const sensorApi: string = await ManagedStorage.getSensorApiEndpoint()

        const installRequest: InstallRequest = {
            key: await ManagedStorage.getInstalKey(),
            label: await ManagedStorage.getSensorLabel(),
        }

        const headers = new Headers({
            'Content-Type': 'application/json'
        })

        const token: string | undefined = currentInfo?.token
        if (token) {
            headers.append("Authorization", `Bearer ${token}`)
        }

        const response = await fetch(`${sensorApi}/install`, {
            method: 'POST',
            body: JSON.stringify(installRequest),
            headers: headers
        })

        if (200 <= response.status && response.status < 300) {
            const responseBody: any = await response.json()
            if (isInstallResponse(responseBody)) {
                return normalizeInstallResponse(responseBody)
            } else {
                throw new Error('Received install response that does not match the expected schema.')
            }
        } else {
            throw new Error(`Received response code ${response.status} for install.`)
        }
    }
}
