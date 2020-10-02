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

export class VirtualTextAreaElement {

    // Then captures of the content from this virtual element are sent to the background
    // and filtered / squelched in the same manner that html input element captures are

    private content: string = ''

    // cursor is the number of characters that precede the current position in the string (insert mode)
    private cursor: number = 0

    keyboard(event: KeyboardEvent) {
        if (event.type === 'keydown') { // only care for keydown events 
            const keyValue: string = event.key

            const keyModified = event.ctrlKey || event.metaKey

            if (ignoreKeys.has(keyValue)) {
                return
            } else if (keyValue === 'ArrowLeft') {
                if (keyModified) {
                    this.moveCursorStart()
                } else {
                    this.moveCursor(-1)
                }
            } else if (keyValue === 'ArrowRight') {
                if (keyModified) {
                    this.moveCursorEnd()
                } else {
                    this.moveCursor(1)
                }
            } else if (keyValue === 'End') {
                this.moveCursorEnd()
            } else if (keyValue === 'Home') {
                this.moveCursorStart()
            } else if (keyValue === 'Backspace') {
                if (keyModified) {
                    this.eraseAllBackward()
                } else {
                    this.backspace()
                }
            } else if (keyValue === 'Delete' && !keyModified) {
                this.delete()
            } else if (keyValue === 'EraseEof') {
                this.eraseAllForward()
            } else if (!keyModified) {
                this.addText(event.key)
            }
        }
    }

    clipboard(event: ClipboardEvent) {
        if (event.type === 'paste') {
            const pasteText = event.clipboardData?.getData("text")
            if (pasteText) {
                this.addText(pasteText)
            }
        }
    }

    drag(event: DragEvent) {
        if (event.type === 'drop') {
            const dragText = event.dataTransfer?.getData("text")
            if (dragText) {
                this.addText(dragText)
            }
        }
    }

    value(): string {
        return this.content
    }

    private moveCursor(shift: number) {
        let newCursor = this.cursor + shift

        if (newCursor < 0) {
            newCursor = 0
        } else if (newCursor > this.content.length) {
            newCursor = this.content.length
        }

        this.cursor = newCursor
    }

    private moveCursorEnd() {
        this.cursor = this.content.length
    }

    private moveCursorStart() {
        this.cursor = 0
    }

    private backspace() {
        if (this.cursor === 0) {
            return // nothing to backspace since we are at the start
        } else {
            const start = this.content.slice(0, this.cursor - 1)
            const end = this.content.slice(this.cursor)
            this.content = start.concat(end)
            this.moveCursor(-1)
        }
    }

    private eraseAllBackward() {
        if (this.cursor === 0) {
            return // nothing to backspace since we are at the start
        } else {
            this.content = this.content.slice(this.cursor)
            this.moveCursorStart()
        }
    }

    private eraseAllForward() {
        if (this.cursor === this.content.length) {
            return // nothing to erase forward if we are at the end
        } else {
            this.content = this.content.slice(0, this.cursor)
        }
        // cursor stays the same since we are deleting forward
    }

    private delete() {
        if (this.cursor === this.content.length) {
            return // nothing to erase forward if we are at the end
        } else {
            const start = this.content.slice(0, this.cursor)
            const end = this.content.slice(this.cursor + 1)
            this.content = start.concat(end)
        }
        // cursor stays the same since we are deleting forward
    }

    private addText(text: string) {
        if (this.cursor === this.content.length) {
            this.content = this.content.concat(text)
        } else {
            const start = this.content.slice(0, this.cursor)
            const end = this.content.slice(this.cursor)
            this.content = start.concat(text, end)
        }
        this.moveCursor(text.length)
    }
}


const ignoreKeysArray = ['Dead', 'Unidentified',  // special values
    'Alt', 'AltGraph', 'CapsLock', 'Control', 'Fn', 'FnLock', 'Hyper', 'Meta', 'NumLock', 'ScrollLock', 'Shift', 'Super', 'Symbol', 'SymbolLock', // modifiers
    'Tab', 'Enter', // Unapplicable whitespace - tab would generally change the focus element. enter would make stuff happen too
    'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', // unapplicable navigators
    'Clear', 'Copy', 'CrSel', 'Cut', 'ExSel', 'Paste', 'Redo', 'Undo', 'Insert', // unapplicable editors
    // TODO: incorporate the Insert key into the virtual text area element
    'Accept', 'Again', 'Attn', 'Cancel', 'ContextMenu', 'Escape', 'Execute', 'Find', 'Finish', 'Help', 'Pause', 'Play', 'Props', 'Select', 'ZoomIn', 'ZoomOut', // unapplicable UI
    'BrightnessDown', 'BrightnessUp', 'Eject', 'LogOff', 'Power', 'PowerOff', 'PrintScreen', 'Hibernate', 'Standby', 'WakeUp', // unapplicable device
    'AllCandidates', 'Alphanumeric', 'CodeInput', 'Compose', 'Convert', 'FinalMode', 'GroupFirst', 'GroupLast', 'GroupNext', 'GroupPrevious', 'ModeChange', 'NextCandidate', 'NonConvert', 'PreviousCandidate', 'Process', 'SingleCandidate', // unapplicable IME and composition
    'HangulMode', 'HanjaMode', 'JunjaMode', // unapplicable korean
    'Eisu', 'Hankaku', 'Hiragana', 'HiraganaKatakana', 'KanaMode', 'KanjiMode', 'Katakana', 'Romaji', 'Zenkaku', 'ZenkakuHanaku',  // unapplicable japanese
    'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19', 'F20', 'Soft1', 'Soft2', 'Soft3', 'Soft4', // unapplicable function
    'AppSwitch', 'Call', 'Camera', 'CameraFocus', 'EndCall', 'GoBack', 'GoHome', 'HeadsetHook', 'LastNumberRedial', 'Notification', 'MannerMode', 'VoiceDial', // phone
    'ChannelDown', 'ChannelUp', 'MediaFastForward', 'MediaPause', 'MediaPlay', 'MediaPlayPause', 'MediaRecord', 'MediaRewind', 'MediaStop', 'MediaTrackNext', 'MediaTrackPrevious', // media
    'AudioBalanceLeft', 'AudioBalanceRight', 'AudioBassDown', 'AudioBassBoostDown', 'AudioBassBoostToggle', 'AudioBassBoostUp', 'AudioBassUp', 'AudioFaderFront', 'AudioFaderRear', 'AudioSurroundModeNext', 'AudioTrebleDown', 'AudioTrebleUp', 'AudioVolumeDown', 'AudioVolumeMute', 'AudioVolumeUp', 'MicrophoneToggle', 'MicrophoneVolumeDown', 'MicrophoneVolumeMute', 'MicrophoneVolumeUp', // audio
    'TV', 'TV3DMode', 'TVAntennaCable', 'TVAudioDescription', 'TVAudioDescriptionMixDown', 'TVAudioDescriptionMixUp', 'TVContentsMenu', 'TVDataService', 'TVInput', 'TVInputComponent1', 'TVInputComponent2', 'TVInputComposite1', 'TVInputComposite2', 'TVInputHDMI1', 'TVInputHDMI2', 'TVInputHDMI3', 'TVInputHDMI4', 'TVInputVGA1', 'TVMediaContext', 'TVNetwork', 'TVNumberEntry', 'TVPower', 'TVRadioService', 'TVSatellite', 'TVSatelliteBS', 'TVSatelliteCS', 'TVSatelliteToggle', 'TVTerrestrialAnalog', 'TVTerrestrialDigital', 'TVTimer', // tv
    'AVRInput', 'AVRPower', 'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue', 'ColorF4Grey', 'ColorF5Brown', 'ClosedCaptionToggle', 'Dimmer', 'DisplaySwap', 'DVR', 'Exit', 'FavoriteClear0', 'FavoriteClear1', 'FavoriteClear2', 'FavoriteClear3', 'FavoriteRecall0', 'FavoriteRecall1', 'FavoriteRecall2', 'FavoriteRecall3', 'FavoriteStore0', 'FavoriteStore1', 'FavoriteStore2', 'FavoriteStore3', 'Guide', 'GuideNextDay', 'GuidePreviousDay', 'Info', 'InstantReplay', 'Link', 'ListProgram', 'LiveContent', 'Lock', 'MediaApps', 'MediaAudioTrack', 'MediaLast', 'MediaSkipBackward', 'MediaSkipForward', 'MediaStepBackward', 'MediaStepForward', 'MediaTopMenu', 'NavigateIn', 'NavigateNext', 'NavigateOut', 'NavigatePrevious', 'NextFavoriteChannel', 'NextUserProfile', 'OnDemand', 'Pairing', 'PinPDown', 'PinPMove', 'PinPToggle', 'PinPUp', 'PlaySpeedDown', 'PlaySpeedReset', 'PlaySpeedUp', 'RandomToggle', 'RcLowBattery', 'RecordSpeedNext', 'RfBypass', 'ScanChannelsToggle', 'ScreenModeNext', 'Settings', 'SplitScreenToggle', 'STBInput', 'STBPower', 'Subtitle', 'Teletext', 'VideoModeNext', 'Wink', 'ZoomToggle', // media controller
    'SpeechCorrectionList', 'SpeechInputToggle', // speech recognition
    'Close', 'New', 'Open', 'Print', 'Save', 'SpellCheck', 'MailForward', 'MailReply', 'MailSend', // document
    'LaunchCalculator', 'LaunchCalendar', 'LaunchContacts', 'LaunchMail', 'LaunchMediaPlayer', 'LaunchMusicPlayer', 'LaunchMyComputer', 'LaunchPhone', 'LaunchScreenSaver', 'LaunchSpreadsheet', 'LaunchWebBrowser', 'LaunchWebCam', 'LaunchWordProcessor', 'LaunchApplication1', 'LaunchApplication2', 'LaunchApplication3', 'LaunchApplication4', 'LaunchApplication5', 'LaunchApplication6', 'LaunchApplication7', 'LaunchApplication8', 'LaunchApplication9', 'LaunchApplication10', 'LaunchApplication11', 'LaunchApplication12', 'LaunchApplication13', 'LaunchApplication14', 'LaunchApplication15', 'LaunchApplication16', // application selector
    'BrowserBack', 'BrowserFavorites', 'BrowserForward', 'BrowserHome', 'BrowserRefresh', 'BrowserSearch', 'BrowserStop', // browser control
    'Key11', 'Key12', 'Separator' // num pad keys which are weird to handle. can look into these in the future
]

const ignoreKeys: Set<string> = new Set<string>()
ignoreKeysArray.forEach(ignoreKey => {
    ignoreKeys.add(ignoreKey)
})
