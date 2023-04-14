import { create } from "zustand"
import produce from "immer"
import { stringify } from "yaml"
import { CustomSkinConfig } from "./CustomSkinStore"

const rimeName = () => {
  const userAgent = navigator.userAgent

  if (userAgent.indexOf("Win") !== -1) {
    return "weasel.custom.yaml"
  } else if (userAgent.indexOf("Mac") !== -1) {
    return "squirrel.custom.yaml"
  }

  return "?.custom.yaml"
}

interface AppOptions {
  [appName: string]: {
    ascii_mode: boolean
  }
}

interface StylePatch {
  "style/horizontal": boolean
  "style/inline_preedit": boolean
  "style/display_tray_icon": boolean
  "style/color_scheme": string
  "style/font_point": number
  "style/layout/min_width": number
  "style/layout/min_height": number
  "style/layout/border_width": number
  "style/layout/margin_x": number
  "style/layout/margin_y": number
  "style/layout/spacing": number
  "style/layout/candidate_spacing": number

  preset_color_schemes: {
    [key: string]: CustomSkinConfig
  }
  app_options: AppOptions
}

type StyleCustomPath =
  | "style/font_point"
  | "style/horizontal"
  | "style/inline_preedit"
  | "style/display_tray_icon"
  | "style/layout/min_width"
  | "style/layout/min_height"
  | "style/layout/border_width"
  | "style/layout/margin_x"
  | "style/layout/margin_y"
  | "style/layout/spacing"
  | "style/layout/candidate_spacing"

interface StyleState {
  fileName: string
  styleCustom: {
    patch: StylePatch
  }
  changeColorScheme: (color_scheme: string, config: CustomSkinConfig) => void

  updateStyleCustom: (path: StyleCustomPath, value: string | number | boolean) => void

  changeAsciiModeApps: (appOptions: string[]) => void
  generateYAML: () => string | null
}

function appOtionsOK(app_options: AppOptions | undefined) {
  if (!app_options) {
    return false
  }
  if (Object.keys(app_options).length !== 2) {
    return false
  }
  return app_options["cmd.exe"].ascii_mode && app_options["conhost.exe"].ascii_mode
}

const useStyleState = create<StyleState>()((set, get) => ({
  fileName: `${rimeName()}`,
  styleCustom: {
    patch: {
      "style/horizontal": false,
      "style/inline_preedit": false,
      "style/display_tray_icon": false,
      "style/color_scheme": "aqua",
      "style/font_point": 14,
      "style/layout/min_width": 160,
      "style/layout/min_height": 0,
      "style/layout/border_width": 3,
      "style/layout/margin_x": 12,
      "style/layout/margin_y": 12,
      "style/layout/spacing": 10,
      "style/layout/candidate_spacing": 5,

      preset_color_schemes: {},
      app_options: {
        "cmd.exe": {
          ascii_mode: true,
        },

        "conhost.exe": {
          ascii_mode: true,
        },
      },
    },
  },

  generateYAML: () => {
    const patch: Partial<StylePatch> = { ...get().styleCustom.patch }

    if (!patch["style/horizontal"]) {
      delete patch["style/horizontal"]
    }
    if (!patch["style/inline_preedit"]) {
      delete patch["style/inline_preedit"]
    }
    if (!patch["style/display_tray_icon"]) {
      delete patch["style/display_tray_icon"]
    }

    const color_scheme_name = patch["style/color_scheme"]
    if (color_scheme_name === "aqua") {
      delete patch["style/color_scheme"]
      delete patch.preset_color_schemes
    } else if (patch.preset_color_schemes && color_scheme_name) {
      patch.preset_color_schemes = {
        [color_scheme_name]: patch.preset_color_schemes[color_scheme_name],
      }
    }

    if (appOtionsOK(patch.app_options)) {
      delete patch.app_options
    }

    if (Object.keys(patch).length === 0) {
      return null
    }

    return stringify({ patch: patch })
  },

  updateStyleCustom: (path, value) =>
    set(
      produce((state: StyleState) => {
        ;(state.styleCustom.patch as any)[path] = value
      })
    ),

  changeColorScheme: (color_scheme_name, color_scheme) =>
    set(
      produce((state) => {
        state.styleCustom.patch["style/color_scheme"] = color_scheme_name
        state.styleCustom.patch.preset_color_schemes[color_scheme_name] = color_scheme
      })
    ),

  changeAsciiModeApps: (appOptions) =>
    set(
      produce((state) => {
        appOptions.forEach((tag: string) => {
          state.styleCustom.patch.app_options[tag] = {
            ascii_mode: true,
          }
        })
      })
    ),
}))

export type { StyleState }
export default useStyleState
