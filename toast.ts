type ToastType =
  | "success"
  // type error @deprecated
  | "error"
  | "danger"
  | "warning"
  | "info"
  | "default";
type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface ToastOptions {
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  delay?: number;
  hideProgress?: boolean;
  closeOnClick?: boolean;
  icon?: string | null;
  hideIcon?: boolean;
  outLine?: boolean;
}

const DEFAULT_OPTIONS: Required<ToastOptions> = {
  type: "default",
  position: "top-right",
  duration: 100,
  delay: 3000,
  hideProgress: false,
  closeOnClick: true,
  icon: null,
  hideIcon: false,
  outLine: false,
};

const COLORS: Record<ToastType, string> = {
  success: "bg-success text-white",
  error: "bg-danger text-white",
  danger: "bg-danger text-white",
  warning: "bg-warning text-white",
  info: "bg-info text-white",
  default: "bg-white",
};

const ICONS: Record<Exclude<ToastType, "default">, string> = {
  success: "fas fa-check-circle",
  error: "fas fa-times-circle",
  danger: "fas fa-times-circle",
  warning: "fas fa-exclamation-triangle",
  info: "fas fa-info-circle",
};

function createElementFromHTML(htmlString: string): HTMLElement {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild as HTMLElement;
}

function showToast(message: string, options: ToastOptions = {}): void {
  var config = { ...DEFAULT_OPTIONS, ...options };
  var {
    type,
    position,
    hideProgress,
    delay,
    closeOnClick,
    duration,
    icon,
    hideIcon,
    outLine,
  } = config;
  if (type == "error") {
    type = "danger";
  }

  let wrapper = document.querySelector<HTMLDivElement>(".toastthk-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    document.body.appendChild(wrapper);
  }
  wrapper.className = `toastthk-wrapper ${position}`;

  const container = document.createElement("div");
  container.className = "toastthk-container";

  const progressHTML = hideProgress
    ? ""
    : `<div class="toastthk-progress-wrap">
        <div class="toastthk-progress ${COLORS[type]}"></div>
      </div>`;

  const toastIcon = icon
    ? `<i class="${icon}"></i>`
    : type !== "default" && ICONS[type]
    ? `<i class="${ICONS[type]}"></i>`
    : "";

  const toastHTML = `
    <div class="toastthk-item ${type} ${outLine ? "" : COLORS[type]}">
      ${!hideIcon ? toastIcon : ""}
      <span>${message}</span>
      ${progressHTML}
    </div>`;

  const toastItem = createElementFromHTML(toastHTML);
  container.appendChild(toastItem);
  wrapper.prepend(container);

  const progressBar =
    toastItem.querySelector<HTMLElement>(".toastthk-progress");

  let startTime = Date.now();
  let remainingTime = delay;
  let timeoutId: ReturnType<typeof setTimeout>;

  const startTimer = () => {
    startTime = Date.now();
    if (progressBar) {
      progressBar.style.transition = `width ${remainingTime}ms linear`;
      progressBar.style.width = "0%";
    }
    timeoutId = setTimeout(
      () => removeToast(container, duration),
      remainingTime
    );
  };

  const pauseTimer = () => {
    clearTimeout(timeoutId);
    remainingTime -= Date.now() - startTime;
    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = `${(remainingTime / delay) * 100}%`;
    }
  };

  setTimeout(() => {
    container.classList.add("show");
    toastItem.classList.add("show");
    calculateHeightOfListContainer(toastItem);

    if (!hideProgress && progressBar) {
      progressBar.style.width = "100%";
      startTimer();
    }
  }, 15);

  if (closeOnClick) {
    toastItem.addEventListener("click", () => removeToast(container, duration));
  }

  toastItem.addEventListener("mouseenter", pauseTimer);
  toastItem.addEventListener("mouseleave", startTimer);
}

function removeToast(container: HTMLElement, duration: number): void {
  container.classList.remove("show");
  Object.assign(container.style, { height: "0", margin: "0" });

  const item = container.querySelector(".toastthk-item");
  if (item) item.classList.remove("show");

  setTimeout(() => container.remove(), duration + 100);
}

function calculateHeightOfListContainer(item: HTMLElement): void {
  const el = $(item);
  const height = el.outerHeight();
  console.log("height", height);
  el.parent().css("height", `${height}px`);
}

// Export to global
(window as any).Toast = {
  show: showToast,
  success: (msg: string, options: ToastOptions = {}) =>
    showToast(msg, { ...options, type: "success" }),
  error: (msg: string, options: ToastOptions = {}) =>
    showToast(msg, { ...options, type: "danger" }),
  danger: (msg: string, options: ToastOptions = {}) =>
    showToast(msg, { ...options, type: "danger" }),
  warning: (msg: string, options: ToastOptions = {}) =>
    showToast(msg, { ...options, type: "warning" }),
  info: (msg: string, options: ToastOptions = {}) =>
    showToast(msg, { ...options, type: "info" }),
};
