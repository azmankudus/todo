import { createSignal, Show, For } from "solid-js";
import { RESOURCES } from "../config/resources";
import { useNavigate } from "@solidjs/router";
import { Motion } from "solid-motionone";
import { TextButton } from "../components/ui/TextButton";
import { TextField } from "../components/ui/TextField";
import { login, register } from "../stores/authStore";
import { showLoading, hideLoading } from "../stores/loadingStore";
import { Modal } from "../components/ui/Modal";
import { Tooltip } from "../components/ui/Tooltip";
import {
  TbOutlineMail, TbOutlineLock, TbOutlineUser, TbOutlineLogin2, TbOutlineShieldCheck,
  TbOutlineMailQuestion, TbOutlineCircleCheck, TbOutlineCloud, TbOutlineChevronLeft,
  TbOutlineBrandChrome, TbOutlineBrandWindows, TbOutlineBrandApple, TbOutlineBrandGithub,
  TbOutlineBrandGitlab, TbOutlineBrandFacebook, TbOutlineBrandTwitter, TbOutlineBrandInstagram,
  TbOutlineBrandTiktok, TbOutlineBrandLinkedin, TbOutlineBrandDiscord, TbOutlineBrandSlack,
  TbOutlinePlus
} from "solid-icons/tb";
import { BsLockFill } from "solid-icons/bs";
import { validatePasswordComplexity, PASSWORD_COMPLEXITY_MESSAGE, validateEmail, EMAIL_HINT } from "../utils/auth-config";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isRegisterOpen, setIsRegisterOpen] = createSignal(false);
  const [isForgotOpen, setIsForgotOpen] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [success, setSuccess] = createSignal<string | null>(null);

  const [authMethod, setAuthMethod] = createSignal<null | 'classic'>(null);
  const [identity, setIdentity] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [fullname, setFullname] = createSignal("");
  const [rememberMe, setRememberMe] = createSignal(false);
  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [isPasswordFocused, setIsPasswordFocused] = createSignal(false);
  const [isIdentityFocused, setIsIdentityFocused] = createSignal(false);
  const [isEmailRegFocused, setIsEmailRegFocused] = createSignal(false);
  const [isEmailForgotFocused, setIsEmailForgotFocused] = createSignal(false);

  const clearError = (field: string) => {
    setErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const showErrors = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
  };

  const resetForm = () => {
    setError(null);
    setErrors({});
    setSuccess(null);
    setIdentity("");
    setEmail("");
    setUsername("");
    setPassword("");
    setFullname("");
  };

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!identity()) newErrors.identity = "Required";
    if (!password()) newErrors.password = "Required";

    if (Object.keys(newErrors).length > 0) {
      showErrors(newErrors);
      return;
    }

    // If it looks like an email, validate format
    if (identity().includes('@') && !validateEmail(identity())) {
      showErrors({ identity: "Invalid format" });
      return;
    }

    showLoading("spinner", "Signing in...");
    const result = await login(identity(), password(), rememberMe());
    hideLoading();

    if (result.success) {
      navigate("/todo", { replace: true });
    } else {
      showErrors({ identity: result.error || "Login failed" });
    }
  };

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!username()) newErrors.username = "Required";
    if (!fullname()) newErrors.fullname = "Required";
    if (!email()) newErrors.email_reg = "Required";
    if (!password()) newErrors.password_reg = "Required";

    if (Object.keys(newErrors).length > 0) {
      showErrors(newErrors);
      return;
    }

    if (!validateEmail(email())) {
      showErrors({ email_reg: "Invalid format" });
      return;
    }

    if (!validatePasswordComplexity(password())) {
      showErrors({ password_reg: PASSWORD_COMPLEXITY_MESSAGE });
      return;
    }

    showLoading("spinner", "Creating account...");
    const result = await register(email(), username(), fullname(), password());
    hideLoading();

    if (result.success) {
      setIsRegisterOpen(false);
      navigate("/todo", { replace: true });
    } else {
      showErrors({ username: result.error || "Registration failed" });
    }
  };

  const handleForgotPassword = async (e: Event) => {
    e.preventDefault();
    if (!email()) {
      showErrors({ email_forgot: "Required" });
      return;
    }

    if (!validateEmail(email())) {
      showErrors({ email_forgot: "Invalid format" });
      return;
    }

    showLoading("spinner", "Sending reset link...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    hideLoading();
    setSuccess("If an account exists with this email, you will receive a password reset link.");
  };

  const oauthProviders = [
    { name: "Google", color: "bg-[#4285F4] hover:bg-[#357AE8]", icon: TbOutlineBrandChrome },
    { name: "Microsoft", color: "bg-[#0078D4] hover:bg-[#005A9E]", icon: TbOutlineBrandWindows },
    { name: "Apple", color: "bg-[#000000] hover:bg-[#111111]", icon: TbOutlineBrandApple },
    { name: "GitHub", color: "bg-[#24292F] hover:bg-[#1A1E22]", icon: TbOutlineBrandGithub },
    { name: "GitLab", color: "bg-[#E24329] hover:bg-[#B13521]", icon: TbOutlineBrandGitlab },
    { name: "Facebook", color: "bg-[#1877F2] hover:bg-[#0D65D9]", icon: TbOutlineBrandFacebook },
    { name: "X", color: "bg-[#000000] hover:bg-[#111111]", icon: TbOutlineBrandTwitter },
    { name: "Instagram", color: "bg-[#E4405F] hover:bg-[#D62976]", icon: TbOutlineBrandInstagram },
    { name: "TikTok", color: "bg-[#000000] hover:bg-[#111111]", icon: TbOutlineBrandTiktok },
    { name: "LinkedIn", color: "bg-[#0077B5] hover:bg-[#005E93]", icon: TbOutlineBrandLinkedin },
    { name: "Discord", color: "bg-[#5865F2] hover:bg-[#4752C4]", icon: TbOutlineBrandDiscord },
    { name: "Slack", color: "bg-[#4A154B] hover:bg-[#3D113E]", icon: TbOutlineBrandSlack },
  ];

  return (
    <main class="min-h-screen flex items-start justify-center px-4 transition-colors duration-500">
      <Motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, easing: [0.16, 1, 0.3, 1] }}
        class="w-full max-w-[420px]"
      >
        <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Form Header (Static) */}
          <div class="px-8 pt-10 pb-0 flex flex-col items-center justify-center text-center z-30 relative bg-white dark:bg-slate-900 gap-4">
            <BsLockFill size={64} class="text-primary-600 dark:text-primary-500 transition-all duration-300" />
            <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Please sign in with your preferred option</p>
          </div>

          {/* Sliding "Stage" Viewport */}
          <div class="relative overflow-hidden w-full h-[420px]">
            <Motion.div
              animate={{ x: authMethod() === null ? "0%" : "-50%" }}
              transition={{ duration: 0.7, easing: [0.16, 1, 0.3, 1] }}
              class="flex w-[200%] h-full flex-row items-stretch"
            >
              {/* Panel 1: Auth Options (Centered stage) */}
              <div class="w-1/2 p-10 flex-shrink-0 flex flex-col justify-center space-y-4">
                <div class="flex flex-col gap-3">
                  <TextButton
                    variant="outline"
                    class="w-full !rounded-xl !py-4 border shadow-none font-bold text-sm uppercase tracking-wider"
                    icon={<TbOutlineCloud size={18} />}
                  >
                    Enterprise SSO
                  </TextButton>
                  <TextButton
                    variant="outline"
                    class="w-full !rounded-xl !py-4 border shadow-none font-bold text-sm uppercase tracking-wider"
                    icon={<TbOutlineShieldCheck size={18} />}
                  >
                    Active Directory
                  </TextButton>
                </div>

                <div class="relative py-1">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-100 dark:border-slate-800"></div>
                  </div>
                </div>

                <div class="flex items-center justify-center gap-2.5 flex-wrap px-2">
                  <For each={oauthProviders}>
                    {(provider) => (
                      <button
                        title={provider.name}
                        class={`${provider.color} text-white p-2.5 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm border border-black/10`}
                      >
                        <provider.icon size={18} />
                      </button>
                    )}
                  </For>
                </div>

                <div class="relative py-1">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-100 dark:border-slate-800"></div>
                  </div>
                </div>

                <TextButton
                  onClick={() => setAuthMethod('classic')}
                  variant="outline"
                  class="w-full !rounded-xl !py-4 border shadow-none font-bold text-sm uppercase tracking-wider"
                  icon={<TbOutlineUser size={18} />}
                >
                  Username / Email
                </TextButton>
              </div>

              {/* Panel 2: Credentials Form (Top aligned inside stage) */}
              <div class="w-1/2 p-10 flex-shrink-0 flex flex-col justify-center space-y-6">

                <form onSubmit={handleLogin} class="space-y-5" novalidate>
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest ml-1">Username or Email</label>
                    <Tooltip active={!!errors().identity || isIdentityFocused()} content={errors().identity || EMAIL_HINT} variant={errors().identity ? "error" : "default"}>
                      <TextField
                        placeholder={`${RESOURCES.PLACEHOLDERS.IDENTITY} or ${RESOURCES.PLACEHOLDERS.EMAIL}`}
                        value={identity()}
                        onInput={(e) => { setIdentity(e.currentTarget.value); clearError('identity'); }}
                        onFocus={() => setIsIdentityFocused(true)}
                        onBlur={() => setIsIdentityFocused(false)}
                        class="!py-4 !rounded-xl"
                      />
                    </Tooltip>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between px-1">
                      <label class="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">Password</label>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setIsForgotOpen(true); }}
                        class="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                      >
                        Forgot?
                      </button>
                    </div>
                    <Tooltip active={!!errors().password} content={errors().password} variant="error">
                      <TextField
                        type="password"
                        placeholder={RESOURCES.PLACEHOLDERS.PASSWORD_LOGIN}
                        value={password()}
                        onInput={(e) => { setPassword(e.currentTarget.value); clearError('password'); }}
                        class="!py-4 !rounded-xl"
                      />
                    </Tooltip>
                  </div>

                  <div class="flex items-center pb-1">
                    <label class="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={rememberMe()}
                        onChange={(e) => setRememberMe(e.currentTarget.checked)}
                        class="accent-primary-600 w-4 h-4 rounded border-slate-300"
                      />
                      <span class="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Remember me</span>
                    </label>
                  </div>

                  <div class="space-y-4 pt-1">
                    <TextButton type="submit" class="w-full !rounded-2xl !py-4 text-base font-black shadow-lg shadow-primary-500/20" icon={<TbOutlineLogin2 size={20} />}>
                      Sign In
                    </TextButton>

                    <div class="flex items-center justify-between px-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { resetForm(); setAuthMethod(null); }}
                        class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary-500 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setIsRegisterOpen(true); }}
                        class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary-500 transition-colors"
                      >
                        REGISTER
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </Motion.div>
          </div>
        </div>
      </Motion.div>

      {/* Registration Modal */}
      <Modal
        isOpen={isRegisterOpen()}
        onClose={() => setIsRegisterOpen(false)}
        title="New User"
        icon={<TbOutlineUser size={22} />}
        class="!max-w-[500px]"
      >

        <form onSubmit={handleRegister} class="space-y-6" novalidate>
          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <Tooltip active={!!errors().fullname} content={errors().fullname} variant="error">
              <TextField
                placeholder={RESOURCES.PLACEHOLDERS.FULLNAME}
                value={fullname()}
                onInput={(e) => { setFullname(e.currentTarget.value); clearError('fullname'); }}
                class="!rounded-xl !py-3"
              />
            </Tooltip>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <Tooltip active={!!errors().username} content={errors().username} variant="error">
              <TextField
                placeholder={RESOURCES.PLACEHOLDERS.USERNAME}
                value={username()}
                onInput={(e) => { setUsername(e.currentTarget.value); clearError('username'); }}
                class="!rounded-xl !py-3"
              />
            </Tooltip>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <Tooltip active={!!errors().email_reg || isEmailRegFocused()} content={errors().email_reg || EMAIL_HINT} variant={errors().email_reg ? "error" : "default"}>
              <TextField
                type="email"
                placeholder={RESOURCES.PLACEHOLDERS.EMAIL}
                value={email()}
                onInput={(e) => { setEmail(e.currentTarget.value); clearError('email_reg'); }}
                onFocus={() => setIsEmailRegFocused(true)}
                onBlur={() => setIsEmailRegFocused(false)}
                class="!rounded-xl !py-3"
              />
            </Tooltip>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <Tooltip active={!!errors().password_reg || isPasswordFocused()} content={errors().password_reg || PASSWORD_COMPLEXITY_MESSAGE} variant={errors().password_reg ? "error" : "default"}>
              <TextField
                type="password"
                placeholder={RESOURCES.PLACEHOLDERS.PASSWORD_REGISTER}
                value={password()}
                onInput={(e) => { setPassword(e.currentTarget.value); clearError('password_reg'); }}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
                class="!rounded-xl !py-3"
              />
            </Tooltip>
          </div>

          <TextButton type="submit" class="w-full !rounded-2xl !py-4 font-black text-base shadow-xl shadow-primary-500/20" icon={<TbOutlinePlus size={20} />}>
            Register
          </TextButton>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen()}
        onClose={() => setIsForgotOpen(false)}
        title="Forgot Password"
        icon={<TbOutlineMailQuestion size={22} />}
      >

        <Show when={success()} fallback={
          <form onSubmit={handleForgotPassword} class="space-y-6" novalidate>
            <div class="space-y-4">
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Enter your registered email to proceed with account recovery process
              </p>
              <Tooltip active={!!errors().email_forgot || isEmailForgotFocused()} content={errors().email_forgot || EMAIL_HINT} variant={errors().email_forgot ? "error" : "default"}>
                <TextField
                  type="email"
                  placeholder={RESOURCES.PLACEHOLDERS.EMAIL}
                  value={email()}
                  onInput={(e) => { setEmail(e.currentTarget.value); clearError('email_forgot'); }}
                  onFocus={() => setIsEmailForgotFocused(true)}
                  onBlur={() => setIsEmailForgotFocused(false)}
                  class="!rounded-xl !py-4"
                />
              </Tooltip>
            </div>
            <TextButton type="submit" class="w-full !rounded-2xl !py-4 font-black shadow-lg shadow-primary-500/20" icon={<TbOutlineMail size={20} />}>
              Submit
            </TextButton>
          </form>
        }>
          <div class="text-center space-y-6 py-4">
            <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <TbOutlineCircleCheck size={40} />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white">Relay Success</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{success()}</p>
            </div>
            <TextButton onClick={() => setIsForgotOpen(false)} variant="outline" class="w-full !rounded-xl !py-4 shadow-none">
              Return to Login
            </TextButton>
          </div>
        </Show>
      </Modal>
    </main>
  );
}
