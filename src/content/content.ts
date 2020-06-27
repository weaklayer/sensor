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

import { ContentHub } from './ContentHub'
import { WindowEvent, createWindowEvent } from '../common/events/WindowEvent'
import { WindowLocationEventGenerator } from './WindowLocationEventGenerator'

// We hold onto this event here as most events in this window will link to it
const windowEvent: WindowEvent = createWindowEvent()

const contentHub = new ContentHub()

contentHub.submitEvent(windowEvent)

const windowLocationEventGenerator = new WindowLocationEventGenerator(windowEvent.time, (e) => contentHub.submitEvent(e))
