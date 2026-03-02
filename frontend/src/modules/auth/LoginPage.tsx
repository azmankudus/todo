import { createSignal, Show, For } from "solid-js";
import { RESOURCES } from "../../config/resources";
import { useNavigate } from "@solidjs/router";
import { Motion } from "solid-motionone";
import { TextButton } from "../../shared/components/ui/TextButton";
import { TextField } from "../../shared/components/ui/TextField";
import { login, register } from "../../shared/stores/authStore";
import { showLoading, hideLoading } from "../../shared/stores/loadingStore";
import { Modal } from "../../shared/components/ui/Modal";
import { Tooltip } from "../../shared/components/ui/Tooltip";
import {
  TbOutlineMail, TbOutlineLock, TbOutlineUser, TbOutlineLogin2, TbOutlineShieldCheck,
  TbOutlineMailQuestion, TbOutlineCircleCheck, TbOutlineCloud, TbOutlineChevronLeft,
  TbOutlineBrandChrome, TbOutlineBrandWindows, TbOutlineBrandApple, TbOutlineBrandGithub,
  TbOutlineBrandGitlab, TbOutlineBrandFacebook, TbOutlineBrandTwitter, TbOutlineBrandInstagram,
  TbOutlineBrandTiktok, TbOutlineBrandLinkedin, TbOutlineBrandDiscord, TbOutlineBrandSlack,
  TbOutlinePlus
} from "solid-icons/tb";
import { BsLockFill } from "solid-icons/bs";
import { validatePasswordComplexity, validateEmail } from "../../shared/utils/authConfig";

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
    if (!identity()) newErrors.identity = RESOURCES.COMMON.REQUIRED;
    if (!password()) newErrors.password = RESOURCES.COMMON.REQUIRED;

    if (Object.keys(newErrors).length > 0) {
      showErrors(newErrors);
      return;
    }

    // If it looks like an email, validate format
    if (identity().includes('@') && !validateEmail(identity())) {
      showErrors({ identity: RESOURCES.COMMON.INVALID_FORMAT });
      return;
    }

    showLoading("spinner", RESOURCES.AUTH.SIGNING_IN);
    const result = await login(identity(), password(), rememberMe());
    hideLoading();

    if (result.success) {
      navigate("/todo", { replace: true });
    } else {
      showErrors({ identity: result.error || RESOURCES.AUTH.LOGIN_FAILED });
    }
  };

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!username()) newErrors.username = RESOURCES.COMMON.REQUIRED;
    if (!fullname()) newErrors.fullname = RESOURCES.COMMON.REQUIRED;
    if (!email()) newErrors.email_reg = RESOURCES.COMMON.REQUIRED;
    if (!password()) newErrors.password_reg = RESOURCES.COMMON.REQUIRED;

    if (Object.keys(newErrors).length > 0) {
      showErrors(newErrors);
      return;
    }

    if (!validateEmail(email())) {
      showErrors({ email_reg: RESOURCES.COMMON.INVALID_FORMAT });
      return;
    }

    if (!validatePasswordComplexity(password())) {
      showErrors({ password_reg: RESOURCES.AUTH.PASSWORD_COMPLEXITY });
      return;
    }

    showLoading("spinner", RESOURCES.AUTH.CREATING_ACCOUNT);
    const result = await register(email(), username(), fullname(), password());
    hideLoading();

    if (result.success) {
      setIsRegisterOpen(false);
      navigate("/todo", { replace: true });
    } else {
      showErrors({ username: result.error || RESOURCES.AUTH.REGISTRATION_FAILED });
    }
  };

  const handleForgotPassword = async (e: Event) => {
    e.preventDefault();
    if (!email()) {
      showErrors({ email_forgot: RESOURCES.COMMON.REQUIRED });
      return;
    }

    if (!validateEmail(email())) {
      showErrors({ email_forgot: RESOURCES.COMMON.INVALID_FORMAT });
      return;
    }

    showLoading("spinner", RESOURCES.AUTH.SENDING_RESET_LINK);
    await new Promise(resolve => setTimeout(resolve, 1500));
    hideLoading();
    setSuccess(RESOURCES.AUTH.RESET_LINK_SENT);
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
            <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{RESOURCES.AUTH.PLEASE_SIGN_IN}</p>
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
                    {RESOURCES.AUTH.ENTERPRISE_SSO}
                  </TextButton>
                  <TextButton
                    variant="outline"
                    class="w-full !rounded-xl !py-4 border shadow-none font-bold text-sm uppercase tracking-wider"
                    icon={<TbOutlineShieldCheck size={18} />}
                  >
                    {RESOURCES.AUTH.ACTIVE_DIRECTORY}
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
                  {RESOURCES.AUTH.USERNAME_OR_EMAIL}
                </TextButton>
              </div>

              {/* Panel 2: Credentials Form (Top aligned inside stage) */}
              <div class="w-1/2 p-10 flex-shrink-0 flex flex-col justify-center space-y-6">

                <form onSubmit={handleLogin} class="space-y-5" novalidate>
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest ml-1">{RESOURCES.AUTH.USERNAME_OR_EMAIL}</label>
                    <Tooltip class="block w-full" active={!!errors().identity || isIdentityFocused()} content={errors().identity || RESOURCES.AUTH.EMAIL_HINT} variant={errors().identity ? "error" : "default"}>
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
                      <label class="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">{RESOURCES.AUTH.PASSWORD}</label>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setIsForgotOpen(true); }}
                        class="text-[10px] font-black text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                      >
                        {RESOURCES.AUTH.FORGOT_LINK}
                      </button>
                    </div>
                    <Tooltip class="block w-full" active={!!errors().password} content={errors().password} variant="error">
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
                      <span class="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{RESOURCES.AUTH.REMEMBER_ME}</span>
                    </label>
                  </div>

                  <div class="space-y-4 pt-1">
                    <TextButton type="submit" class="w-full !rounded-2xl !py-4 text-base font-black shadow-lg shadow-primary-500/20" icon={<TbOutlineLogin2 size={20} />}>
                      {RESOURCES.COMMON.SIGN_IN}
                    </TextButton>

                    <div class="flex items-center justify-between px-1 pt-1">
                      <button
                        type="button"
                        onClick={() => { resetForm(); setAuthMethod(null); }}
                        class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary-500 transition-colors"
                      >
                        {RESOURCES.COMMON.BACK}
                      </button>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setIsRegisterOpen(true); }}
                        class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary-500 transition-colors"
                      >
                        {RESOURCES.AUTH.REGISTER_LINK}
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
        title={RESOURCES.AUTH.NEW_USER}
        icon={<TbOutlineUser size={22} />}
        class="!max-w-[500px]"
      >

        <form onSubmit={handleRegister} class="space-y-6" novalidate>
          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{RESOURCES.AUTH.FULL_NAME}</label>
            <Tooltip class="block w-full" active={!!errors().fullname} content={errors().fullname} variant="error">
              <TextField
                placeholder={RESOURCES.PLACEHOLDERS.FULLNAME}
                value={fullname()}
                onInput={(e) => { setFullname(e.currentTarget.value); clearError('fullname'); }}
                class="!rounded-xl !py-3"
              />
            </Tooltip>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{RESOURCES.AUTH.USERNAME}</label>
            <Tooltip class="block w-full" active={!!errors().username} content={errors().username} variant="error">
              <TextField
                placeholder={RESOURCES.PLACEHOLDERS.USERNAME}
                value={username()}
                onInput={(e) => { setUsername(e.currentTarget.value); clearError('username'); }}
                class="!rounded-xl !py-3"
              />
            </Tooltip>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{RESOURCES.AUTH.EMAIL}</label>
            <Tooltip class="block w-full" active={!!errors().email_reg || isEmailRegFocused()} content={errors().email_reg || RESOURCES.AUTH.EMAIL_HINT} variant={errors().email_reg ? "error" : "default"}>
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
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{RESOURCES.AUTH.PASSWORD}</label>
            <Tooltip class="block w-full" active={!!errors().password_reg || isPasswordFocused()} content={errors().password_reg || RESOURCES.AUTH.PASSWORD_COMPLEXITY} variant={errors().password_reg ? "error" : "default"}>
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
            {RESOURCES.COMMON.REGISTER}
          </TextButton>
        </form>
      </Modal>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotOpen()}
        onClose={() => setIsForgotOpen(false)}
        title={RESOURCES.AUTH.FORGOT_PASSWORD_TITLE}
        icon={<TbOutlineMailQuestion size={22} />}
      >

        <Show when={success()} fallback={
          <form onSubmit={handleForgotPassword} class="space-y-6" novalidate>
            <div class="space-y-4">
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {RESOURCES.AUTH.FORGOT_PASSWORD_DESC}
              </p>
              <Tooltip class="block w-full" active={!!errors().email_forgot || isEmailForgotFocused()} content={errors().email_forgot || RESOURCES.AUTH.EMAIL_HINT} variant={errors().email_forgot ? "error" : "default"}>
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
              {RESOURCES.COMMON.SUBMIT}
            </TextButton>
          </form>
        }>
          <div class="text-center space-y-6 py-4">
            <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <TbOutlineCircleCheck size={40} />
            </div>
            <div class="space-y-2">
              <h3 class="text-2xl font-black text-slate-900 dark:text-white">{RESOURCES.AUTH.RELAY_SUCCESS}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 font-medium">{success()}</p>
            </div>
            <TextButton onClick={() => setIsForgotOpen(false)} variant="outline" class="w-full !rounded-xl !py-4 shadow-none">
              {RESOURCES.COMMON.RETURN_TO_LOGIN}
            </TextButton>
          </div>
        </Show>
      </Modal>
    </main>
  );
}
