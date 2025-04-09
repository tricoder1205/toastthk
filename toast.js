(function (global) {
    'use strict';

    const DEFAULT_OPTIONS = {
        type: 'default',
        position: 'top-right',
        duration: 100,
        delay: 3000,
        hideProgress: false,
        closeOnClick: true,
        icon: null,
        hideIcon: false
    };

    const COLORS = {
        success: 'bg-success text-white',
        error: 'bg-danger text-white',
        warning: 'bg-warning text-white',
        info: 'bg-info text-white',
        default: 'bg-white'
    };

    const ICONS = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    function createElementFromHTML(htmlString) {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    function showToast(message, options = {}) {
        const config = { ...DEFAULT_OPTIONS, ...options };
        const { type, position, hideProgress, delay, closeOnClick, duration, icon, hideIcon } = config;

        let wrapper = document.querySelector('.toastthk-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = `toastthk-wrapper ${position}`;
            document.body.appendChild(wrapper);
        } else {
            wrapper.className = `toastthk-wrapper ${position}`;
        }

        const container = document.createElement('div');
        container.className = 'toastthk-container';

        const progressHTML = hideProgress ? '' :
            `<div class="toastthk-progress-wrap"><div class="toastthk-progress ${COLORS[type]}"></div></div>`;

        const toastIcon = icon ? `<i class="${icon}"></i>` : (ICONS[type] ? `<i class="${ICONS[type]}"></i>` : '');

        const toastHTML = `
            <div class="toastthk-item ${COLORS[type]}">
                ${!hideIcon ? toastIcon : ''}
                <span>${message}</span>
                ${progressHTML}
            </div>`;

        const toastItem = createElementFromHTML(toastHTML);
        container.appendChild(toastItem);
        wrapper.prepend(container);

        const progressBar = toastItem.querySelector('.toastthk-progress');

        let startTime = Date.now();
        let remainingTime = delay;
        let timeoutId;

        function startTimer() {
            startTime = Date.now();
            if (progressBar) {
                progressBar.style.transition = `width ${remainingTime}ms linear`;
                progressBar.style.width = '0%';
            }
            timeoutId = setTimeout(() => removeToast(container, duration), remainingTime);
        }

        function pauseTimer() {
            clearTimeout(timeoutId);
            remainingTime -= Date.now() - startTime;
            if (progressBar) {
                progressBar.style.transition = 'none';
                progressBar.style.width = `${(remainingTime / delay) * 100}%`;
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
            toastItem.addEventListener('click', () => removeToast(container, duration));
        }

        toastItem.addEventListener('mouseenter', pauseTimer);
        toastItem.addEventListener('mouseleave', startTimer);
    }

    function removeToast(container, duration) {
        container.classList.remove('show');
        const item = container.querySelector('.toastthk-item');
        if (item) item.classList.remove('show');

        setTimeout(() => container.remove(), duration);
    }

    global.Toast = {
        show: showToast,
        success: (msg, options = {}) => showToast(msg, { ...options, type: 'success' }),
        error: (msg, options = {}) => showToast(msg, { ...options, type: 'error' }),
        warning: (msg, options = {}) => showToast(msg, { ...options, type: 'warning' }),
        info: (msg, options = {}) => showToast(msg, { ...options, type: 'info' })
    };

})(window);