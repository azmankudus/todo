import { createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Motion } from "solid-motionone";
import { TextButton } from "../components/ui/TextButton";
import { TextField } from "../components/ui/TextField";
import { login, register } from "../stores/authStore";
import { showLoading, hideLoading } from "../stores/loadingStore";
import { Modal } from "../components/ui/Modal";
import { TbOutlineMail, TbOutlineLock, TbOutlineUser, TbOutlineArrowRight, TbOutlineBrandGithub, TbOutlineBrandChrome, TbOutlineShieldCheck, TbOutlineMailQuestion, TbOutlineCircleCheck, TbOutlineCloud, TbOutlineLayoutGrid, TbOutlineBrandApple, TbOutlineBrandSlack, TbOutlineMessageCircle, TbOutlineChevronLeft } from "solid-icons/tb";

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
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [rememberMe, setRememberMe] = createSignal(false);

  const resetForm = () => {
    setError(null);
    setSuccess(null);
    setIdentity("");
    setEmail("");
    setUsername("");
    setPassword("");
    setFullname("");
    setConfirmPassword("");
  };

  const handleLogin = async (e: Event) => {
    e.preventDefault();
    setError(null);

    if (!identity() || !password()) {
      setError("Please fill in all fields");
      return;
    }

    showLoading("spinner", "Signing in...");
    const result = await login(identity(), password(), rememberMe());
    hideLoading();

    if (result.success) {
      navigate("/todo", { replace: true });
    } else {
      setError(result.error || "Login failed");
    }
  };

  const handleRegister = async (e: Event) => {
    e.preventDefault();
    setError(null);

    if (!email() || !username() || !fullname() || !password() || !confirmPassword()) {
      setError("Please fill in all fields");
      return;
    }

    if (password() !== confirmPassword()) {
      setError("Passwords do not match");
      return;
    }

    if (password().length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    showLoading("spinner", "Creating account...");
    const result = await register(email(), username(), fullname(), password());
    hideLoading();

    if (result.success) {
      setIsRegisterOpen(false);
      navigate("/todo", { replace: true });
    } else {
      setError(result.error || "Registration failed");
    }
  };

  const handleForgotPassword = async (e: Event) => {
    e.preventDefault();
    setError(null);

    if (!email()) {
      setError("Please enter your email address");
      return;
    }

    showLoading("spinner", "Sending reset link...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    hideLoading();
    setSuccess("If an account exists with this email, you will receive a password reset link.");
  };

  const oauthProviders = [
    { name: "Google", color: "bg-[#4285F4] hover:bg-[#357AE8]", icon: TbOutlineBrandChrome },
    { name: "GitHub", color: "bg-[#24292F] hover:bg-[#1A1E22]", icon: TbOutlineBrandGithub },
    { name: "Microsoft", color: "bg-[#00A4EF] hover:bg-[#008AD8]", icon: TbOutlineLayoutGrid },
    { name: "Apple", color: "bg-[#000000] hover:bg-[#111111]", icon: TbOutlineBrandApple },
    { name: "Slack", color: "bg-[#4A154B] hover:bg-[#3D113E]", icon: TbOutlineBrandSlack },
    { name: "Discord", color: "bg-[#5865F2] hover:bg-[#4752C4]", icon: TbOutlineMessageCircle },
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
          <div class="px-8 py-6 border-b border-slate-100 dark:border-slate-800/50 flex flex-col items-center justify-center text-center gap-1 z-30 relative bg-white dark:bg-slate-900">
            <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Welcome</h1>
            <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">Please sign in with your preferred option</p>
          </div>

          {/* Sliding "Stage" Viewport */}
          <div class="relative overflow-hidden w-full h-[500px]">
            <Motion.div
              animate={{ x: authMethod() === null ? "0%" : "-50%" }}
              transition={{ duration: 0.7, easing: [0.16, 1, 0.3, 1] }}
              class="flex w-[200%] h-full flex-row items-stretch"
            >
              {/* Panel 1: Auth Options (Centered stage) */}
              <div class="w-1/2 p-10 flex-shrink-0 flex flex-col justify-center space-y-6">
                <div class="grid grid-cols-2 gap-3">
                  <TextButton
                    variant="outline"
                    class="!rounded-xl !py-4 border shadow-none font-bold text-[10px] uppercase tracking-wider"
                    icon={<TbOutlineCloud size={18} />}
                  >
                    Enterprise SSO
                  </TextButton>
                  <TextButton
                    variant="outline"
                    class="!rounded-xl !py-4 border shadow-none font-bold text-[10px] uppercase tracking-wider"
                  >
                    <div class="flex items-center gap-2">
                      <TbOutlineShieldCheck size={18} />
                      <span>AD Sign In</span>
                    </div>
                  </TextButton>
                </div>

                <div class="relative py-1">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-100 dark:border-slate-800"></div>
                  </div>
                </div>

                <div class="flex items-center justify-center gap-3">
                  <For each={oauthProviders}>
                    {(provider) => (
                      <button
                        title={provider.name}
                        class={`${provider.color} text-white p-3 rounded-xl transition-all hover:scale-110 active:scale-95 shadow-sm`}
                      >
                        <provider.icon size={20} />
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
                  class="w-full !rounded-xl !py-4 border shadow-none font-bold"
                  icon={<TbOutlineUser size={18} />}
                >
                  Username / Email
                </TextButton>
              </div>

              {/* Panel 2: Credentials Form (Top aligned inside stage) */}
              <div class="w-1/2 p-10 flex-shrink-0 flex flex-col justify-center space-y-6">
                <Show when={error()}>
                  <Motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3"
                  >
                    <div class="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {error()}
                  </Motion.div>
                </Show>

                <form onSubmit={handleLogin} class="space-y-5">
                  <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest ml-1">Username or Email</label>
                    <TextField
                      placeholder="john.doe or name@company.com"
                      value={identity()}
                      onInput={(e) => setIdentity(e.currentTarget.value)}
                      class="!py-4 !rounded-xl"
                    />
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
                    <TextField
                      type="password"
                      placeholder="••••••••••••"
                      value={password()}
                      onInput={(e) => setPassword(e.currentTarget.value)}
                      class="!py-4 !rounded-xl"
                    />
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
                    <TextButton type="submit" class="w-full !rounded-2xl !py-4 text-base font-black shadow-lg shadow-primary-500/20" icon={<TbOutlineArrowRight size={20} />}>
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
                        Create
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
        title="Create Identity"
        icon={<TbOutlineUser size={22} />}
        class="!max-w-[500px]"
      >
        <Show when={error()}>
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
            <div class="w-1.5 h-1.5 rounded-full bg-red-500" />
            {error()}
          </div>
        </Show>

        <form onSubmit={handleRegister} class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <TextField
                placeholder="johndoe"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                class="!rounded-xl !py-3"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <TextField
                placeholder="John Doe"
                value={fullname()}
                onInput={(e) => setFullname(e.currentTarget.value)}
                class="!rounded-xl !py-3"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <TextField
              type="email"
              placeholder="name@company.com"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              class="!rounded-xl !py-3"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <TextField
                type="password"
                placeholder="••••••••"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                class="!rounded-xl !py-3"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Confirm</label>
              <TextField
                type="password"
                placeholder="••••••••"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                class="!rounded-xl !py-3"
              />
            </div>
          </div>
          <TextButton type="submit" class="w-full !rounded-2xl !py-4 font-black text-base shadow-xl shadow-primary-500/20" icon={<TbOutlineArrowRight size={20} />}>
            Establish Account
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
        <Show when={error()}>
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold">
            {error()}
          </div>
        </Show>

        <Show when={success()} fallback={
          <form onSubmit={handleForgotPassword} class="space-y-6">
            <div class="space-y-4">
              <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Enter your registered email to proceed with account recovery process
              </p>
              <TextField
                type="email"
                placeholder="name@company.com"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                class="!rounded-xl !py-4"
              />
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
