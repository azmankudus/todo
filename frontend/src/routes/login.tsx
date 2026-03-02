import { createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Motion } from "solid-motionone";
import { Button } from "../components/ui/Button";
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
    { name: "TbOutlineBrandApple", color: "bg-[#000000] hover:bg-[#111111]", icon: TbOutlineBrandApple },
    { name: "TbOutlineBrandSlack", color: "bg-[#4A154B] hover:bg-[#3D113E]", icon: TbOutlineBrandSlack },
    { name: "Discord", color: "bg-[#5865F2] hover:bg-[#4752C4]", icon: TbOutlineMessageCircle },
  ];

  return (
    <main class="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Decorative background elements with enhanced gradients */}
      <div class="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-primary-500/10 blur-[150px] rounded-full -z-10 animate-pulse" />
      <div class="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-secondary-500/10 blur-[150px] rounded-full -z-10 animate-pulse" style={{ "animation-delay": "1s" }} />

      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, easing: [0.22, 1, 0.36, 1] }}
        class="w-full max-w-[480px]"
      >
        <div class="bg-white/80 dark:bg-slate-900/80 rounded-[3rem] shadow-2xl shadow-primary-500/10 border border-slate-200/50 dark:border-slate-800/50 overflow-hidden backdrop-blur-2xl">
          <div class="bg-gradient-to-r from-primary-600 to-secondary-500 p-12 text-center relative overflow-hidden group">
            {/* Animated overlay */}
            <div class="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-20deg]" />

            <Motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              class="inline-flex items-center justify-center p-5 bg-white/15 rounded-3xl mb-6 text-white shadow-inner backdrop-blur-md"
            >
              <TbOutlineLock size={36} stroke-width={2.5} class="drop-shadow-lg" />
            </Motion.div>
            <h1 class="text-4xl font-black text-white tracking-tight mb-2 drop-shadow-md">Todo Vibe</h1>
            <p class="text-white/90 font-bold uppercase tracking-[0.2em] text-[10px] opacity-80 mt-3">Advanced Productivity Suite</p>
          </div>

          <div class="p-10 space-y-8">
            <Show when={error()}>
              <Motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3"
              >
                <div class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                {error()}
              </Motion.div>
            </Show>

            <Show when={authMethod() === null} fallback={
              <Motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                class="space-y-8"
              >
                <div class="flex items-center gap-4">
                  <button
                    onClick={() => setAuthMethod(null)}
                    class="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary-500 transition-all hover:scale-105"
                  >
                    <TbOutlineChevronLeft size={20} />
                  </button>
                  <h2 class="text-2xl font-black text-slate-800 dark:text-white">Account Login</h2>
                </div>

                <form onSubmit={handleLogin} class="space-y-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-black text-slate-900 dark:text-slate-300 ml-1">Username or Email</label>
                    <div class="relative group">
                      <TbOutlineUser class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <TextField
                        placeholder="john.doe or name@company.com"
                        value={identity()}
                        onInput={(e) => setIdentity(e.currentTarget.value)}
                        class="pl-14 !py-5 transition-all !rounded-2xl border-slate-200/50 dark:border-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 font-medium"
                      />
                    </div>
                  </div>

                  <div class="space-y-2">
                    <div class="flex items-center justify-between px-1">
                      <label class="block text-sm font-black text-slate-900 dark:text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => { resetForm(); setIsForgotOpen(true); }}
                        class="text-xs font-black text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-wider"
                      >
                        Forgot?
                      </button>
                    </div>
                    <div class="relative group">
                      <TbOutlineLock class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                      <TextField
                        type="password"
                        placeholder="••••••••••••"
                        value={password()}
                        onInput={(e) => setPassword(e.currentTarget.value)}
                        class="pl-14 !py-5 transition-all !rounded-2xl border-slate-200/50 dark:border-slate-800 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 font-medium"
                      />
                    </div>
                  </div>

                  <div class="flex items-center">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe()}
                          onChange={(e) => setRememberMe(e.currentTarget.checked)}
                          class="peer sr-only"
                        />
                        <div class="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-all flex items-center justify-center text-white">
                          <Show when={rememberMe()}><TbOutlineCircleCheck size={14} fill="currentColor" /></Show>
                        </div>
                      </div>
                      <span class="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Keep me signed in</span>
                    </label>
                  </div>

                  <Button type="submit" class="w-full !rounded-3xl !py-7 shadow-2xl shadow-primary-500/30 text-lg font-black tracking-tight" icon={<TbOutlineArrowRight size={22} />}>
                    Unlock Dashboard
                  </Button>
                </form>
              </Motion.div>
            }>
              <Motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                class="space-y-6"
              >
                <div class="space-y-3 pb-2">
                  <Button
                    class="w-full !rounded-2xl !py-6 bg-indigo-600 hover:bg-indigo-700 border-0 shadow-lg shadow-indigo-600/20 text-white font-black"
                    icon={<TbOutlineCloud size={20} />}
                  >
                    Enterprise SSO
                  </Button>
                  <Button
                    variant="outline"
                    class="w-full !rounded-2xl !py-6 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-black text-slate-700 dark:text-slate-200"
                    icon={<TbOutlineShieldCheck size={20} />}
                  >
                    Active Directory
                  </Button>
                </div>

                <div class="relative py-2">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div class="relative flex justify-center text-[10px] uppercase">
                    <span class="bg-white dark:bg-slate-900 px-4 text-slate-400 font-black tracking-[0.3em]">OAuth Gateways</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <For each={oauthProviders}>
                    {(provider) => (
                      <button
                        class={`${provider.color} text-white font-bold p-4 rounded-2xl transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-black/5`}
                      >
                        <provider.icon size={20} />
                        <span class="text-sm">{provider.name}</span>
                      </button>
                    )}
                  </For>
                </div>

                <div class="relative py-2">
                  <div class="absolute inset-0 flex items-center">
                    <div class="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                </div>

                <Button
                  onClick={() => setAuthMethod('classic')}
                  variant="outline"
                  class="w-full !rounded-2xl !py-6 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-black"
                  icon={<TbOutlineMail size={20} />}
                >
                  Username or Email
                </Button>
              </Motion.div>
            </Show>
          </div>

          <div class="px-10 pb-12 pt-4 text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400 font-bold bg-slate-100/50 dark:bg-slate-800/30 py-4 px-6 rounded-3xl">
              New to Todo Vibe?{" "}
              <button
                onClick={() => { resetForm(); setIsRegisterOpen(true); }}
                class="text-primary-600 hover:text-primary-700 font-black transition-colors underline decoration-2 underline-offset-4"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>

        <div class="mt-12 text-center flex items-center justify-center gap-8">
          <button
            onClick={() => navigate("/")}
            class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Back to Home
          </button>
          <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <button class="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Infrastructure Status</button>
        </div>
      </Motion.div>

      {/* Registration Modal */}
      <Modal
        isOpen={isRegisterOpen()}
        onClose={() => setIsRegisterOpen(false)}
        title="Create Identity"
        icon={<TbOutlineUser size={28} />}
        class="!max-w-[520px]"
      >
        <Show when={error()}>
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-red-500" />
            {error()}
          </div>
        </Show>

        <form onSubmit={handleRegister} class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Username</label>
              <TextField
                placeholder="johndoe"
                value={username()}
                onInput={(e) => setUsername(e.currentTarget.value)}
                class="!rounded-2xl !py-4"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Full Name</label>
              <TextField
                placeholder="John Doe"
                value={fullname()}
                onInput={(e) => setFullname(e.currentTarget.value)}
                class="!rounded-2xl !py-4"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Email</label>
            <TextField
              type="email"
              placeholder="name@company.com"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              class="!rounded-2xl !py-4"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Password</label>
              <TextField
                type="password"
                placeholder="••••••••"
                value={password()}
                onInput={(e) => setPassword(e.currentTarget.value)}
                class="!rounded-2xl !py-4"
              />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider ml-1">Confirm</label>
              <TextField
                type="password"
                placeholder="••••••••"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                class="!rounded-2xl !py-4"
              />
            </div>
          </div>
          <Button type="submit" class="w-full !rounded-3xl !py-7 shadow-2xl shadow-primary-500/20 font-black text-lg" icon={<TbOutlineArrowRight size={22} />}>
            Establish Account
          </Button>
        </form>
      </Modal>

      {/* Forgot Password Modal remains same but with updated styling */}
      <Modal
        isOpen={isForgotOpen()}
        onClose={() => setIsForgotOpen(false)}
        title="Recovery Protocol"
        icon={<TbOutlineMailQuestion size={28} />}
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
                Identity verification requires your registered email. We will dispatch an encrypted recovery sequence.
              </p>
              <TextField
                type="email"
                placeholder="name@company.com"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                class="!rounded-2xl !py-5"
              />
            </div>
            <Button type="submit" class="w-full !rounded-3xl !py-7 shadow-2xl shadow-primary-500/20 font-black" icon={<TbOutlineMail size={22} />}>
              Initiate Recovery
            </Button>
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
            <Button onClick={() => setIsForgotOpen(false)} variant="outline" class="w-full !rounded-2xl !py-4">
              Return to Login
            </Button>
          </div>
        </Show>
      </Modal>
    </main>
  );
}
