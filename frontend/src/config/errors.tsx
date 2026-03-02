import { JSXElement } from "solid-js";
import { TbOutlineSearchOff, TbOutlineServerOff, TbOutlineShieldExclamation, TbOutlineWifiOff, TbOutlineClock, TbOutlineMessageOff, TbOutlineKey, TbOutlineBan, TbOutlineBolt, TbOutlineCloudOff, TbOutlineHourglass, TbOutlineCreditCard, TbOutlineShield, TbOutlineLock, TbOutlineGitBranch, TbOutlineTrash, TbOutlineRuler, TbOutlineCircleCheck, TbOutlineBox, TbOutlineLink, TbOutlineFileCode, TbOutlineMap, TbOutlineEye, TbOutlineCoffee, TbOutlineCompass, TbOutlineCpu, TbOutlineStack, TbOutlinePlayerSkipForward, TbOutlineCircleArrowUp, TbOutlineClipboardList, TbOutlineFileDescription, TbOutlineGavel, TbOutlineHammer, TbOutlineNetwork, TbOutlineRefresh, TbOutlineDatabase, TbOutlineInfinity, TbOutlinePuzzle, TbOutlineFingerprint, TbOutlineAlertCircle, TbOutlineGlobe } from "solid-icons/tb";

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
    name: "Bad Request",
    description: "The message was garbled by space debris. Our computers can't make sense of your request.",
    icon: (size) => <TbOutlineMessageOff size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "401": {
    code: "401",
    name: "Unauthorized",
    description: "Halt! You haven't scanned your DNA at the security terminal yet. Show us your credentials.",
    icon: (size) => <TbOutlineKey size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "402": {
    code: "402",
    name: "Payment Required",
    description: "Your galactic credit balance is zero. Please deposit some tokens to proceed through the toll gate.",
    icon: (size) => <TbOutlineCreditCard size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "403": {
    code: "403",
    name: "Forbidden",
    description: "Our security bots have flagged your entry. You don't have the clearance for this quadrant.",
    icon: (size) => <TbOutlineShieldExclamation size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "404": {
    code: "404",
    name: "Not Found",
    description: "We've scanned the entire sector, but this page seems to have disappeared into a black hole.",
    icon: (size) => <TbOutlineSearchOff size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "405": {
    code: "405",
    name: "Method Not Allowed",
    description: "You're trying to perform a maneuver that's prohibited in this gravity well.",
    icon: (size) => <TbOutlineBan size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "406": {
    code: "406",
    name: "Not Acceptable",
    description: "Our sensors can't process the data format you're sending. It's like talking to an alien.",
    icon: (size) => <TbOutlineShield size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "407": {
    code: "407",
    name: "Proxy Authentication Required",
    description: "The gateway requires DNA verification from a recognized proxy server before letting you pass.",
    icon: (size) => <TbOutlineGlobe size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "408": {
    code: "408",
    name: "Request Timeout",
    description: "Our signals got lost in deep space. The connection dissipated before we could finish.",
    icon: (size) => <TbOutlineClock size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "409": {
    code: "409",
    name: "Conflict",
    description: "Two versions of the same reality are trying to exist at once. Please resolve the paradox.",
    icon: (size) => <TbOutlineGitBranch size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "410": {
    code: "410",
    name: "Gone",
    description: "This resource used to exist, but it's been vaporized. It's gone forever from the starmaps.",
    icon: (size) => <TbOutlineTrash size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "411": {
    code: "411",
    name: "Length Required",
    description: "The message is missing its size metadata. We need to know how big the shipment is.",
    icon: (size) => <TbOutlineRuler size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "412": {
    code: "412",
    name: "Precondition Failed",
    description: "The atmospheric conditions aren't right. Your preconditions for this request weren't met.",
    icon: (size) => <TbOutlineCircleCheck size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "413": {
    code: "413",
    name: "Payload Too Large",
    description: "The payload is too heavy for our tractor beams to lift. Try sending a smaller batch.",
    icon: (size) => <TbOutlineBox size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "414": {
    code: "414",
    name: "URI Too Long",
    description: "The flight path you specified is too complex for our navigation computers to plot.",
    icon: (size) => <TbOutlineLink size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "415": {
    code: "415",
    name: "Unsupported Media Type",
    description: "The media type you sent is built with unknown technology. We can't interface with it.",
    icon: (size) => <TbOutlineFileCode size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "416": {
    code: "416",
    name: "Range Not Satisfiable",
    description: "You're asking for a data range that's outside the known boundaries of this archive.",
    icon: (size) => <TbOutlineMap size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "417": {
    code: "417",
    name: "Expectation Failed",
    description: "Our station couldn't meet the high expectations set in your transmission headers.",
    icon: (size) => <TbOutlineEye size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "418": {
    code: "418",
    name: "I'm a teapot",
    description: "I'm a short and stout teapot. I refuse to brew coffee in this high-tech space lab.",
    icon: (size) => <TbOutlineCoffee size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "421": {
    code: "421",
    name: "Misdirected Request",
    description: "Your ship arrived at the wrong docking bay. This server isn't configured for this request.",
    icon: (size) => <TbOutlineCompass size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "422": {
    code: "422",
    name: "Unprocessable Entity",
    description: "The instructions are syntactically correct but logically impossible in this reality.",
    icon: (size) => <TbOutlineCpu size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "423": {
    code: "423",
    name: "Locked",
    description: "The resource is currently locked in a stasis field. Try again once it's released.",
    icon: (size) => <TbOutlineLock size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "424": {
    code: "424",
    name: "Failed Dependency",
    description: "The request failed because its dependent mission was aborted or failed.",
    icon: (size) => <TbOutlineStack size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "425": {
    code: "425",
    name: "Too Early",
    description: "You're trying to jump to warp before the engines have even started spinning up.",
    icon: (size) => <TbOutlinePlayerSkipForward size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "426": {
    code: "426",
    name: "Upgrade Required",
    description: "Your ship's firmware is too old. You need to upgrade your protocol to proceed.",
    icon: (size) => <TbOutlineCircleArrowUp size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "428": {
    code: "428",
    name: "Precondition Required",
    description: "The server requires a complete pre-flight checklist before it can process this.",
    icon: (size) => <TbOutlineClipboardList size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "429": {
    code: "429",
    name: "Too Many Requests",
    description: "Too many ships are trying to pass through the warp gate at once. Please wait your turn.",
    icon: (size) => <TbOutlineBolt size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "431": {
    code: "431",
    name: "Request Header Fields Too Large",
    description: "The metadata you sent is so heavy it's causing local gravitational distortions.",
    icon: (size) => <TbOutlineFileDescription size={size} stroke-width={2.0} />,
    isServerError: false
  },
  "451": {
    code: "451",
    name: "Unavailable For Legal Reasons",
    description: "By order of the Galactic Council, access to this resource has been legally restricted.",
    icon: (size) => <TbOutlineGavel size={size} stroke-width={2.0} />,
    isServerError: false
  },

  // --- 50x Server Errors ---
  "500": {
    code: "500",
    name: "Internal Server Error",
    description: "The engines are overheating! Something went wrong on the server, and our engineers have been alerted.",
    icon: (size) => <TbOutlineServerOff size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "501": {
    code: "501",
    name: "Not Implemented",
    description: "We haven't finished building this part of the ship yet. Try again in a future update.",
    icon: (size) => <TbOutlineHammer size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "502": {
    code: "502",
    name: "Bad Gateway",
    description: "The jump gate is flickering. The relay station isn't responding correctly.",
    icon: (size) => <TbOutlineCloudOff size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "503": {
    code: "503",
    name: "Service Unavailable",
    description: "The station is undergoing maintenance. We'll be back online once the fusion reactor restarts.",
    icon: (size) => <TbOutlineWifiOff size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "504": {
    code: "504",
    name: "Gateway Timeout",
    description: "The long-range communications array is lagging. The server response took too long to arrive.",
    icon: (size) => <TbOutlineHourglass size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "505": {
    code: "505",
    name: "HTTP Version Not Supported",
    description: "We're using different versions of the communication protocol. We can't shake hands.",
    icon: (size) => <TbOutlineNetwork size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "506": {
    code: "506",
    name: "Variant Also Negotiates",
    description: "The server is caught in an infinite negotiation loop. We're going in circles!",
    icon: (size) => <TbOutlineRefresh size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "507": {
    code: "507",
    name: "Insufficient Storage",
    description: "We don't have enough storage space left on the station to hold your data.",
    icon: (size) => <TbOutlineDatabase size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "508": {
    code: "508",
    name: "Loop Detected",
    description: "Your request keeps coming back to us in a loop. We've hit a temporal anomaly.",
    icon: (size) => <TbOutlineInfinity size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "510": {
    code: "510",
    name: "Not Extended",
    description: "The server needs further extensions to fulfill this request. We're missing some modules.",
    icon: (size) => <TbOutlinePuzzle size={size} stroke-width={2.0} />,
    isServerError: true
  },
  "511": {
    code: "511",
    name: "TbOutlineNetwork Authentication Required",
    description: "You need to authenticate with the relay network before we can forward your signal.",
    icon: (size) => <TbOutlineFingerprint size={size} stroke-width={2.0} />,
    isServerError: true
  },

  "default": {
    code: "---",
    name: "Unexpected Anomaly",
    description: "A glitch in the matrix occurred. We're not sure what it is, but it's definitely not supposed to be here.",
    icon: (size) => <TbOutlineAlertCircle size={size} stroke-width={2.0} />,
    isServerError: true
  }
};

export function getErrorConfig(code?: string | number): ErrorConfig {
  const codeStr = String(code);
  return ERROR_CONFIGS[codeStr] || ERROR_CONFIGS.default;
}
