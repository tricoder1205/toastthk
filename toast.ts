type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

interface ToastOptions {
    type?: ToastType;
    position?: ToastPosition;
    duration?: number;
    delay?: number;
    hideProgress?: boolean;
    closeOnClick?: boolean;
    icon?: string | null;
    hideIcon?: boolean;
}

const DEFAULT_OPTIONS: ToastOptions = {
    type: 'default',
    position: 'top-right',
    duration: 300,
    delay: 3000,
    hideProgress: false,
    closeOnClick: true,
    icon: null,
    hideIcon: false
};

const COLORS: Record<ToastType, string> = {
    success: 'bg-success text-white',
    error: 'bg-danger text-white',
    warning: 'bg-warning text-white',
    info: 'bg-info text-white',
    default: 'bg-white'
};

const ICONS: Record<ToastType, string> = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
    default: ''
};

function createElementFromHTML(html: string): HTMLElement {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild as HTMLElement;
}

function showToast(message: string, options: ToastOptions = {}): void {
    const config: ToastOptions = { ...DEFAULT_OPTIONS, ...options };
    const { type, position, hideProgress, delay, closeOnClick, duration, icon, hideIcon } = config;

    let wrapper = document.querySelector('.toast-wrapper') as HTMLElement;
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = `toast-wrapper ${position}`;
        document.body.appendChild(wrapper);
    } else {
        wrapper.className = `toast-wrapper ${position}`;
    }

    const container = document.createElement('div');
    container.className = 'toast-container';

    const progressHTML = hideProgress ? '' :
        `<div class="toast-progress-wrap"><div class="toast-progress ${COLORS[type!]}"></div></div>`;

    const toastIcon = icon ? `<i class="${icon}"></i>` : (ICONS[type!] ? `<i class="${ICONS[type!]}"></i>` : '');

    const toastHTML = `
        <div class="toast-item d-flex ${COLORS[type!]} align-items-center rounded-lg">
            ${!hideIcon ? toastIcon : ''}
            <span>${message}</span>
            ${progressHTML}
        </div>`;

    const toastItem = createElementFromHTML(toastHTML);
    container.appendChild(toastItem);
    wrapper.prepend(container);

    const progressBar = toastItem.querySelector('.toast-progress') as HTMLElement | null;

    let startTime = Date.now();
    let remainingTime = delay!;
    let timeoutId: number;

    function startTimer() {
        startTime = Date.now();
        if (progressBar) {
            progressBar.style.transition = `width ${remainingTime}ms linear`;
            progressBar.style.width = '0%';
        }
        timeoutId = window.setTimeout(() => removeToast(container, duration!), remainingTime);
    }

    function pauseTimer() {
        clearTimeout(timeoutId);
        remainingTime -= Date.now() - startTime;
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = `${(remainingTime / delay!) * 100}%`;
        }
    }

    setTimeout(() => {
        container.classList.add('show');
        toastItem.classList.add('show');
        container.style.transition = `all ${duration}ms ease-out`;
        toastItem.style.transition = `all ${duration}ms ease-out`;

        if (!hideProgress && progressBar) {
            progressBar.style.width = '100%';
            startTimer();
        }
    }, 15);

    if (closeOnClick) {
        toastItem.addEventListener('click', () => removeToast(container, duration!));
    }

    toastItem.addEventListener('mouseenter', pauseTimer);
    toastItem.addEventListener('mouseleave', startTimer);
}

function removeToast(container: HTMLElement, duration: number) {
    container.classList.remove('show');
    const item = container.querySelector('.toast-item');
    if (item) item.classList.remove('show');

    setTimeout(() => container.remove(), duration);
}

export const Toast = { show: showToast };