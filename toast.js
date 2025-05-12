(function (global) {
  "use strict";

  const DEFAULT_OPTIONS = {
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

  const COLORS = {
    success: "bg-success text-white",
    danger: "bg-danger text-white",
    warning: "bg-warning text-white",
    info: "bg-info text-white",
    default: "bg-white",
  };

  const ICONS = {
    success: "fas fa-check-circle",
    danger: "fas fa-times-circle",
    warning: "fas fa-exclamation-triangle",
    info: "fas fa-info-circle",
  };

  const createElementFromHTML = (htmlString) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  function showToast(message, options = {}) {
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
    // type error @deprecated
    if (type == "error") {
      type = "danger";
    }

    let wrapper = document.querySelector(".toastthk-wrapper");
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
      : ICONS[type]
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

    const progressBar = toastItem.querySelector(".toastthk-progress");

    let startTime = Date.now();
    let remainingTime = delay;
    let timeoutId;

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
      $(container).addClass("show");
      $(toastItem).addClass("show");
      calculateHeightOfListContainer(toastItem);

      if (!hideProgress && progressBar) {
        progressBar.style.width = "100%";
        startTimer();
      }
    }, 15);

    if (closeOnClick) {
      toastItem.addEventListener("click", () =>
        removeToast(container, duration)
      );
    }

    toastItem.addEventListener("mouseenter", pauseTimer);
    toastItem.addEventListener("mouseleave", startTimer);
  }

  function removeToast(container, duration) {
    $(container).removeClass("show").css({ height: 0, margin: 0 });
    const item = container.querySelector(".toastthk-item");
    if (item) item.classList.remove("show");
    setTimeout(() => container.remove(), duration + 100);
  }

  function calculateHeightOfListContainer(item) {
    const $el = $(item);
    const height = $el.outerHeight();
    $el.find("span").css({ "max-height": `${height - 10}px` });
    $el.parent().css("height", `${height}px`);
  }

  global.Toast = {
    show: showToast,
    success: (msg, options = {}) =>
      showToast(msg, { ...options, type: "success" }),
    danger: (msg, options = {}) =>
      showToast(msg, { ...options, type: "danger" }),
    error: (msg, options = {}) =>
      showToast(msg, { ...options, type: "danger" }),
    warning: (msg, options = {}) =>
      showToast(msg, { ...options, type: "warning" }),
    info: (msg, options = {}) => showToast(msg, { ...options, type: "info" }),
  };
})(window);
