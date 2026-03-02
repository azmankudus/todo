import { JSX } from "solid-js";

export const backgrounds = {
  wavy: () => (
    <>
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-[100%] bg-gradient-to-br from-primary-300/30 to-secondary-400/30 dark:from-primary-900/30 dark:to-secondary-800/30 blur-[80px] transform -rotate-12" />
      <div class="absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-[100%] bg-gradient-to-bl from-secondary-300/30 to-primary-400/30 dark:from-secondary-900/30 dark:to-primary-800/30 blur-[100px] transform rotate-12" />
      <div class="absolute -bottom-[20%] left-[10%] w-[50%] h-[50%] rounded-[100%] bg-gradient-to-tr from-primary-300/20 to-secondary-400/20 dark:from-primary-800/20 dark:to-secondary-800/20 blur-[90px]" />
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwdjhINFYweiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-50 dark:opacity-20 pointer-events-none mix-blend-overlay" />
    </>
  ),
  blobs: () => (
    <>
      <div class="absolute top-10 left-10 w-72 h-72 bg-primary-400/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob dark:bg-primary-800/50" />
      <div class="absolute top-10 right-10 w-72 h-72 bg-secondary-400/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 dark:bg-secondary-800/50" />
      <div class="absolute -bottom-8 left-20 w-72 h-72 bg-primary-300/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 dark:bg-primary-700/50" />
    </>
  ),
  mesh: () => (
    <>
      <div class="absolute inset-0 bg-[radial-gradient(at_0%_0%,var(--color-primary-300)_0,transparent_70%),radial-gradient(at_50%_0%,var(--color-secondary-300)_0,transparent_70%),radial-gradient(at_100%_0%,var(--color-primary-300)_0,transparent_70%)] opacity-40 dark:opacity-20 pointer-events-none" />
    </>
  ),
  grid: () => (
    <>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#80808025_1px,transparent_1px),linear-gradient(to_bottom,#80808025_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div class="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,var(--color-primary-300),transparent)] dark:bg-[radial-gradient(circle_400px_at_50%_300px,var(--color-primary-800),transparent)] pointer-events-none opacity-50 dark:opacity-30 mix-blend-multiply dark:mix-blend-screen" />
    </>
  ),
  dots: () => (
    <>
      <div class="absolute inset-0 bg-[radial-gradient(#9ca3af_1px,transparent_1px)] dark:bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />
    </>
  ),
  aurora: () => (
    <>
      <div class="absolute inset-0 bg-gradient-to-br from-primary-200/40 via-secondary-200/40 to-primary-200/40 dark:from-primary-900/30 dark:via-secondary-900/30 dark:to-primary-900/30 opacity-70 pointer-events-none" />
      <div class="absolute top-[-50%] left-[-10%] w-[120%] h-[120%] rounded-[100%] bg-[conic-gradient(from_0deg_at_50%_50%,var(--color-primary-400)_0deg,var(--color-secondary-400)_180deg,var(--color-primary-400)_360deg)] filter blur-[100px] opacity-20 dark:opacity-10 pointer-events-none transform -rotate-12 animate-pulse" />
    </>
  ),
  topography: () => (
    <>
      <div class="absolute inset-0 bg-primary-100/50 dark:bg-slate-900 pointer-events-none -z-20" />
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIj48cGF0aCBkPSJNMTAwIDEwMGM1MCA1MCAxNTAgNTAgMjAwIDBzNTAgMTUwIDAgMTUwUzUwIDE1MCAwIDE1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none mix-blend-overlay" />
    </>
  ),
  waves: () => (
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.08] dark:opacity-[0.05]">
      <svg class="absolute bottom-0 w-full h-[30vh] min-h-[250px] text-primary-400 dark:text-primary-800" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fill-opacity="0.3" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path fill="none" class="text-primary-600 dark:text-primary-600" stroke="currentColor" stroke-opacity="0.4" stroke-width="4" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128"></path>
      </svg>
      <svg class="absolute bottom-0 w-full h-[20vh] min-h-[150px] text-secondary-500 dark:text-secondary-800" preserveAspectRatio="none" viewBox="0 0 1440 320">
        <path fill="currentColor" fill-opacity="0.4" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        <path fill="none" class="text-secondary-700 dark:text-secondary-600" stroke="currentColor" stroke-opacity="0.5" stroke-width="5" d="M0,256L48,229.3C96,203,192,149,288,154.7C384,160,480,224,576,218.7C672,213,768,139,864,128C960,117,1056,171,1152,197.3C1248,224,1344,224,1392,224L1440,224"></path>
      </svg>
    </div>
  ),
  geometric: () => (
    <>
      <div class="absolute top-[10%] left-[10%] w-48 h-48 rounded-full bg-gradient-to-tr from-primary-400 to-primary-100 dark:from-primary-600 dark:to-primary-900 p-[3px] opacity-10">
        <div class="w-full h-full rounded-full bg-slate-50 dark:bg-slate-950 backdrop-blur-sm" />
      </div>
      <div class="absolute bottom-[10%] right-[10%] w-64 h-64 transform rotate-[30deg] bg-gradient-to-br from-secondary-500 to-secondary-200 dark:from-secondary-600 dark:to-secondary-900 p-[4px] opacity-10">
        <div class="w-full h-full bg-slate-50 dark:bg-slate-950 backdrop-blur-sm" />
      </div>
      <div class="absolute top-[40%] right-[15%] w-32 h-32 transform -rotate-[15deg] bg-gradient-to-bl from-primary-500 to-primary-300 dark:from-primary-500 dark:to-primary-800 p-[2px] opacity-[0.12]">
        <div class="w-full h-full bg-slate-50 dark:bg-slate-950 backdrop-blur-sm" />
      </div>
      <div class="absolute bottom-[40%] left-[15%] w-48 h-48 transform rotate-[45deg] bg-gradient-to-br from-secondary-400 to-secondary-100 dark:from-secondary-700 dark:to-secondary-900 p-[2px] opacity-[0.12] flex items-center justify-center">
        <div class="w-[95%] h-[95%] bg-slate-50 dark:bg-slate-950 backdrop-blur-sm flex items-center justify-center">
          <div class="w-[50%] h-[50%] bg-gradient-to-br from-primary-400/20 to-primary-200/20 rounded-full" />
        </div>
      </div>
      <div class="absolute top-[60%] left-[40%] text-primary-500 dark:text-primary-700 opacity-10 transform rotate-12 scale-150">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0L93.3013 75H6.69873L50 0Z" stroke="currentColor" stroke-width="4" />
        </svg>
      </div>
    </>
  ),
  minimal: () => (
    <>
      <div class="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 pointer-events-none" />
    </>
  ),
  circles: () => (
    <>
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-[0.03] flex justify-center items-center">
        <div class="absolute w-[800px] h-[800px] border-[3px] border-primary-500 rounded-full" />
        <div class="absolute w-[600px] h-[600px] border-[3px] border-secondary-500 rounded-full" />
        <div class="absolute w-[400px] h-[400px] border-[3px] border-primary-500 rounded-full" />
        <div class="absolute w-[200px] h-[200px] border-[3px] border-secondary-500 rounded-full" />
      </div>
    </>
  ),
  stripes: () => (
    <div class="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-[0.03] bg-[repeating-linear-gradient(45deg,var(--color-primary-300),var(--color-primary-300)_10px,transparent_10px,transparent_40px)]" />
  ),
  zigzag: () => (
    <div class="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-[0.03]" style="background: linear-gradient(135deg, var(--color-primary-300) 25%, transparent 25%) -50px 0, linear-gradient(225deg, var(--color-primary-300) 25%, transparent 25%) -50px 0, linear-gradient(315deg, var(--color-primary-300) 25%, transparent 25%), linear-gradient(45deg, var(--color-primary-300) 25%, transparent 25%); background-size: 100px 100px;" />
  ),
  honeycomb: () => (
    <div class="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-[0.03]" style="background-image: radial-gradient(var(--color-primary-400) 2px, transparent 2px), radial-gradient(var(--color-secondary-400) 2px, transparent 2px); background-position: 0 0, 25px 25px; background-size: 50px 50px;" />
  ),
  crosshatch: () => (
    <div class="absolute inset-0 w-full h-full pointer-events-none opacity-10 dark:opacity-[0.03] bg-[repeating-linear-gradient(45deg,var(--color-primary-400)_0_3px,transparent_3px_20px),repeating-linear-gradient(-45deg,var(--color-secondary-400)_0_3px,transparent_3px_20px)]" />
  ),
  particles: () => (
    <>
      <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-40 dark:opacity-30">
        <div class="absolute top-[20%] left-[20%] w-4 h-4 rounded-full bg-primary-500 shadow-[0_0_20px_var(--color-primary-500)]" />
        <div class="absolute top-[60%] left-[80%] w-6 h-6 rounded-full bg-secondary-500 shadow-[0_0_25px_var(--color-secondary-500)]" />
        <div class="absolute top-[80%] left-[10%] w-8 h-8 rounded-full bg-primary-400 shadow-[0_0_35px_var(--color-primary-400)]" />
        <div class="absolute top-[10%] left-[70%] w-4 h-4 rounded-full bg-secondary-400 shadow-[0_0_20px_var(--color-secondary-400)]" />
        <div class="absolute top-[40%] left-[50%] w-3 h-3 rounded-full bg-primary-600 shadow-[0_0_15px_var(--color-primary-600)]" />
        <div class="absolute top-[90%] left-[60%] w-5 h-5 rounded-full bg-secondary-300 shadow-[0_0_25px_var(--color-secondary-300)]" />
      </div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-slate-200/20 dark:to-slate-900/40 pointer-events-none" />
    </>
  ),
  squares: () => (
    <div class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05] dark:opacity-[0.02] overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div class="absolute border-[4px] border-primary-500 transition-transform duration-700 hover:scale-110" style={`
          width: ${20 + (i * 13) % 150}px;
          height: ${20 + (i * 13) % 150}px;
          top: ${(i * 23) % 100}%;
          left: ${(i * 29) % 100}%;
          transform: rotate(${(i * 31) % 180}deg);
          border-color: ${i % 2 === 0 ? 'var(--color-primary-500)' : 'var(--color-secondary-500)'};
        `} />
      ))}
    </div>
  ),
  isometric: () => (
    <div class="absolute inset-0 w-full h-full pointer-events-none opacity-5 dark:opacity-[0.02]" style="background-image: linear-gradient(30deg, var(--color-primary-300) 12%, transparent 12.5%, transparent 87%, var(--color-primary-300) 87.5%, var(--color-primary-300)), linear-gradient(150deg, var(--color-primary-300) 12%, transparent 12.5%, transparent 87%, var(--color-primary-300) 87.5%, var(--color-primary-300)), linear-gradient(30deg, var(--color-primary-300) 12%, transparent 12.5%, transparent 87%, var(--color-primary-300) 87.5%, var(--color-primary-300)), linear-gradient(150deg, var(--color-primary-300) 12%, transparent 12.5%, transparent 87%, var(--color-primary-300) 87.5%, var(--color-primary-300)), linear-gradient(60deg, var(--color-secondary-300) 25%, transparent 25.5%, transparent 75%, var(--color-secondary-300) 75%, var(--color-secondary-300)), linear-gradient(60deg, var(--color-secondary-300) 25%, transparent 25.5%, transparent 75%, var(--color-secondary-300) 75%, var(--color-secondary-300)); background-size: 80px 140px; background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;" />
  ),
  kaleidoscope: () => (
    <div class="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center opacity-10 dark:opacity-[0.03]">
      <div class="w-[80vw] h-[80vw] bg-[conic-gradient(var(--color-primary-500),var(--color-secondary-500),var(--color-primary-500),var(--color-secondary-500),var(--color-primary-500),var(--color-secondary-500),var(--color-primary-500))] rounded-full animate-spin [animation-duration:60s] blur-3xl mix-blend-multiply dark:mix-blend-screen" />
    </div>
  ),
  nova: () => (
    <div class="absolute inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-[0.02] mix-blend-multiply dark:mix-blend-screen">
      <div class="absolute top-[50%] left-[50%] w-[100vw] h-[100vw] rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,var(--color-primary-500)_0%,transparent_60%)] filter blur-3xl opacity-60" />
      <div class="absolute top-[50%] left-[50%] w-[50vw] h-[50vw] rounded-full transform -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,var(--color-secondary-400)_90deg,transparent_180deg,var(--color-primary-400)_270deg,transparent_360deg)] animate-[spin_30s_linear_infinite]" />
    </div>
  )
};
