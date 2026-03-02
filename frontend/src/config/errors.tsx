import { JSXElement } from "solid-js";
import { TbOutlineSearchOff, TbOutlineServerOff, TbOutlineShieldExclamation, TbOutlineWifiOff, TbOutlineClock, TbOutlineMessageOff, TbOutlineKey, TbOutlineBan, TbOutlineBolt, TbOutlineCloudOff, TbOutlineHourglass, TbOutlineCreditCard, TbOutlineShield, TbOutlineLock, TbOutlineGitBranch, TbOutlineTrash, TbOutlineRuler, TbOutlineCircleCheck, TbOutlineBox, TbOutlineLink, TbOutlineFileCode, TbOutlineMap, TbOutlineEye, TbOutlineCoffee, TbOutlineCompass, TbOutlineCpu, TbOutlineStack, TbOutlinePlayerSkipForward, TbOutlineCircleArrowUp, TbOutlineClipboardList, TbOutlineFileDescription, TbOutlineGavel, TbOutlineHammer, TbOutlineNetwork, TbOutlineRefresh, TbOutlineDatabase, TbOutlineInfinity, TbOutlinePuzzle, TbOutlineFingerprint, TbOutlineAlertCircle, TbOutlineGlobe } from "solid-icons/tb";

import { RESOURCES } from "./resources";

export interface ErrorConfig {
  code: string;
  name: string;
  description: string;
  icon: (size: number) => JSXElement;
  isServerError: boolean;
}

export const ERROR_CONFIGS: Record<string, ErrorConfig> = {
  // --- 40x Client Errors ---
  "400": {
    code: "400",
    name: RESOURCES.ERROR_CATALOG.E400.NAME,
    description: RESOURCES.ERROR_CATALOG.E400.DESCRIPTION,
    icon: (size) => <TbOutlineMessageOff size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "401": {
    code: "401",
    name: RESOURCES.ERROR_CATALOG.E401.NAME,
    description: RESOURCES.ERROR_CATALOG.E401.DESCRIPTION,
    icon: (size) => <TbOutlineKey size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "402": {
    code: "402",
    name: RESOURCES.ERROR_CATALOG.E402.NAME,
    description: RESOURCES.ERROR_CATALOG.E402.DESCRIPTION,
    icon: (size) => <TbOutlineCreditCard size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "403": {
    code: "403",
    name: RESOURCES.ERROR_CATALOG.E403.NAME,
    description: RESOURCES.ERROR_CATALOG.E403.DESCRIPTION,
    icon: (size) => <TbOutlineShieldExclamation size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "404": {
    code: "404",
    name: RESOURCES.ERROR_CATALOG.E404.NAME,
    description: RESOURCES.ERROR_CATALOG.E404.DESCRIPTION,
    icon: (size) => <TbOutlineSearchOff size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "405": {
    code: "405",
    name: RESOURCES.ERROR_CATALOG.E405.NAME,
    description: RESOURCES.ERROR_CATALOG.E405.DESCRIPTION,
    icon: (size) => <TbOutlineBan size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "406": {
    code: "406",
    name: RESOURCES.ERROR_CATALOG.E406.NAME,
    description: RESOURCES.ERROR_CATALOG.E406.DESCRIPTION,
    icon: (size) => <TbOutlineShield size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "407": {
    code: "407",
    name: RESOURCES.ERROR_CATALOG.E407.NAME,
    description: RESOURCES.ERROR_CATALOG.E407.DESCRIPTION,
    icon: (size) => <TbOutlineGlobe size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "408": {
    code: "408",
    name: RESOURCES.ERROR_CATALOG.E408.NAME,
    description: RESOURCES.ERROR_CATALOG.E408.DESCRIPTION,
    icon: (size) => <TbOutlineClock size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "409": {
    code: "409",
    name: RESOURCES.ERROR_CATALOG.E409.NAME,
    description: RESOURCES.ERROR_CATALOG.E409.DESCRIPTION,
    icon: (size) => <TbOutlineGitBranch size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "410": {
    code: "410",
    name: RESOURCES.ERROR_CATALOG.E410.NAME,
    description: RESOURCES.ERROR_CATALOG.E410.DESCRIPTION,
    icon: (size) => <TbOutlineTrash size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "411": {
    code: "411",
    name: RESOURCES.ERROR_CATALOG.E411.NAME,
    description: RESOURCES.ERROR_CATALOG.E411.DESCRIPTION,
    icon: (size) => <TbOutlineRuler size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "412": {
    code: "412",
    name: RESOURCES.ERROR_CATALOG.E412.NAME,
    description: RESOURCES.ERROR_CATALOG.E412.DESCRIPTION,
    icon: (size) => <TbOutlineCircleCheck size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "413": {
    code: "413",
    name: RESOURCES.ERROR_CATALOG.E413.NAME,
    description: RESOURCES.ERROR_CATALOG.E413.DESCRIPTION,
    icon: (size) => <TbOutlineBox size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "414": {
    code: "414",
    name: RESOURCES.ERROR_CATALOG.E414.NAME,
    description: RESOURCES.ERROR_CATALOG.E414.DESCRIPTION,
    icon: (size) => <TbOutlineLink size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "415": {
    code: "415",
    name: RESOURCES.ERROR_CATALOG.E415.NAME,
    description: RESOURCES.ERROR_CATALOG.E415.DESCRIPTION,
    icon: (size) => <TbOutlineFileCode size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "416": {
    code: "416",
    name: RESOURCES.ERROR_CATALOG.E416.NAME,
    description: RESOURCES.ERROR_CATALOG.E416.DESCRIPTION,
    icon: (size) => <TbOutlineMap size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "417": {
    code: "417",
    name: RESOURCES.ERROR_CATALOG.E417.NAME,
    description: RESOURCES.ERROR_CATALOG.E417.DESCRIPTION,
    icon: (size) => <TbOutlineEye size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "418": {
    code: "418",
    name: RESOURCES.ERROR_CATALOG.E418.NAME,
    description: RESOURCES.ERROR_CATALOG.E418.DESCRIPTION,
    icon: (size) => <TbOutlineCoffee size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "421": {
    code: "421",
    name: RESOURCES.ERROR_CATALOG.E421.NAME,
    description: RESOURCES.ERROR_CATALOG.E421.DESCRIPTION,
    icon: (size) => <TbOutlineCompass size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "422": {
    code: "422",
    name: RESOURCES.ERROR_CATALOG.E422.NAME,
    description: RESOURCES.ERROR_CATALOG.E422.DESCRIPTION,
    icon: (size) => <TbOutlineCpu size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "423": {
    code: "423",
    name: RESOURCES.ERROR_CATALOG.E423.NAME,
    description: RESOURCES.ERROR_CATALOG.E423.DESCRIPTION,
    icon: (size) => <TbOutlineLock size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "424": {
    code: "424",
    name: RESOURCES.ERROR_CATALOG.E424.NAME,
    description: RESOURCES.ERROR_CATALOG.E424.DESCRIPTION,
    icon: (size) => <TbOutlineStack size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "425": {
    code: "425",
    name: RESOURCES.ERROR_CATALOG.E425.NAME,
    description: RESOURCES.ERROR_CATALOG.E425.DESCRIPTION,
    icon: (size) => <TbOutlinePlayerSkipForward size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "426": {
    code: "426",
    name: RESOURCES.ERROR_CATALOG.E426.NAME,
    description: RESOURCES.ERROR_CATALOG.E426.DESCRIPTION,
    icon: (size) => <TbOutlineCircleArrowUp size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "428": {
    code: "428",
    name: RESOURCES.ERROR_CATALOG.E428.NAME,
    description: RESOURCES.ERROR_CATALOG.E428.DESCRIPTION,
    icon: (size) => <TbOutlineClipboardList size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "429": {
    code: "429",
    name: RESOURCES.ERROR_CATALOG.E429.NAME,
    description: RESOURCES.ERROR_CATALOG.E429.DESCRIPTION,
    icon: (size) => <TbOutlineBolt size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "431": {
    code: "431",
    name: RESOURCES.ERROR_CATALOG.E431.NAME,
    description: RESOURCES.ERROR_CATALOG.E431.DESCRIPTION,
    icon: (size) => <TbOutlineFileDescription size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "451": {
    code: "451",
    name: RESOURCES.ERROR_CATALOG.E451.NAME,
    description: RESOURCES.ERROR_CATALOG.E451.DESCRIPTION,
    icon: (size) => <TbOutlineGavel size={size} stroke-width={2.0} />,
    isServerError: false
  },

  // --- 50x Server Errors ---
  "500": {
    code: "500",
    name: RESOURCES.ERROR_CATALOG.E500.NAME,
    description: RESOURCES.ERROR_CATALOG.E500.DESCRIPTION,
    icon: (size) => <TbOutlineServerOff size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "501": {
    code: "501",
    name: RESOURCES.ERROR_CATALOG.E501.NAME,
    description: RESOURCES.ERROR_CATALOG.E501.DESCRIPTION,
    icon: (size) => <TbOutlineHammer size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "502": {
    code: "502",
    name: RESOURCES.ERROR_CATALOG.E502.NAME,
    description: RESOURCES.ERROR_CATALOG.E502.DESCRIPTION,
    icon: (size) => <TbOutlineCloudOff size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "503": {
    code: "503",
    name: RESOURCES.ERROR_CATALOG.E503.NAME,
    description: RESOURCES.ERROR_CATALOG.E503.DESCRIPTION,
    icon: (size) => <TbOutlineWifiOff size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "504": {
    code: "504",
    name: RESOURCES.ERROR_CATALOG.E504.NAME,
    description: RESOURCES.ERROR_CATALOG.E504.DESCRIPTION,
    icon: (size) => <TbOutlineHourglass size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "505": {
    code: "505",
    name: RESOURCES.ERROR_CATALOG.E505.NAME,
    description: RESOURCES.ERROR_CATALOG.E505.DESCRIPTION,
    icon: (size) => <TbOutlineNetwork size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "506": {
    code: "506",
    name: RESOURCES.ERROR_CATALOG.E506.NAME,
    description: RESOURCES.ERROR_CATALOG.E506.DESCRIPTION,
    icon: (size) => <TbOutlineRefresh size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "507": {
    code: "507",
    name: RESOURCES.ERROR_CATALOG.E507.NAME,
    description: RESOURCES.ERROR_CATALOG.E507.DESCRIPTION,
    icon: (size) => <TbOutlineDatabase size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "508": {
    code: "508",
    name: RESOURCES.ERROR_CATALOG.E508.NAME,
    description: RESOURCES.ERROR_CATALOG.E508.DESCRIPTION,
    icon: (size) => <TbOutlineInfinity size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "510": {
    code: "510",
    name: RESOURCES.ERROR_CATALOG.E510.NAME,
    description: RESOURCES.ERROR_CATALOG.E510.DESCRIPTION,
    icon: (size) => <TbOutlinePuzzle size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "511": {
    code: "511",
    name: RESOURCES.ERROR_CATALOG.E511.NAME,
    description: RESOURCES.ERROR_CATALOG.E511.DESCRIPTION,
    icon: (size) => <TbOutlineFingerprint size={size} stroke-width={2.0} />,
    isServerError: true
  },

  "default": {
    code: "---",
    name: RESOURCES.ERROR_CATALOG.UNKNOWN.NAME,
    description: RESOURCES.ERROR_CATALOG.UNKNOWN.DESCRIPTION,
    icon: (size) => <TbOutlineAlertCircle size={size} stroke-width={2.0} />,
    isServerError: true
  }
};

export function getErrorConfig(code?: string | number): ErrorConfig {
  const codeStr = String(code);
  return ERROR_CONFIGS[codeStr] || ERROR_CONFIGS.default;
}
