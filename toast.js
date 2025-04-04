/**
 * Usage Examples:
 * 
 * Toast.show('This is a default toast');
 * Toast.show('Success message', { type: 'success' });
 * Toast.show('Error message', { type: 'error', icon: 'fas fa-bug' });
 * Toast.show('Custom Icon Toast', { icon: 'fas fa-smile', position: 'bottom-left' });
 */

(function (global, $) {
    'use strict';

    const DEFAULT_OPTIONS = {
        type: 'default',
        position: 'top-right',
        duration: 300,
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

    function showToast(message, options = {}) {
        const config = { ...DEFAULT_OPTIONS, ...options };
        const { type, position, hideProgress, delay, closeOnClick, duration, icon, hideIcon } = config;

        if (!$('.toast-wrapper').length) {
            $('body').append('<div class="toast-wrapper"></div>');
        }

        const toasts = $('.toast-wrapper').attr('class', `toast-wrapper ${position}`);
        const $container = $('<div class="toast-container"></div>');
        const progressBar = hideProgress ? '' : `<div class="toast-progress-wrap"><div class="toast-progress ${COLORS[type]}\"></div></div>`;

        const toastIcon = icon ? `<i class="${icon}"></i>` : `<i class="${ICONS[type] || ''}"></i>`;

        const $listItem = $(
            `<div class="toast-item d-flex ${COLORS[type]} align-items-center rounded-lg">
                ${!hideIcon ? toastIcon : ''}
                <span>${message}</span>
                ${progressBar}
            </div>`
        );

        toasts.prepend($container.append($listItem));
        const $progress = $listItem.find('.toast-progress');

        let startTime = Date.now();
        let remainingTime = delay;
        let timeoutId;

        function startTimer() {
            startTime = Date.now();
            $progress.css({ transition: `width ${remainingTime}ms linear`, width: '0%' });
            timeoutId = setTimeout(() => removeToast($container, duration), remainingTime);
        }

        function pauseTimer() {
            clearTimeout(timeoutId);
            remainingTime -= Date.now() - startTime;
            $progress.css({ transition: 'none', width: `${(remainingTime / delay) * 100}%` });
        }

        setTimeout(() => {
            $container.addClass('show').css({ transition: `all ${duration}ms ease-out` });
            $listItem.addClass('show').css({ transition: `all ${duration}ms ease-out` });
            if (!hideProgress) {
                $progress.css({ width: '100%' });
                startTimer();
            }
        }, 15);

        if (closeOnClick) {
            $listItem.on('click', () => removeToast($container, duration));
        }

        $listItem.on('mouseenter', pauseTimer);
        $listItem.on('mouseleave', startTimer);
    }

    function removeToast($container, duration) {
        $container.removeClass('show').find('.toast-item').removeClass('show');
        setTimeout(() => $container.remove(), duration);
    }

    global.Toast = { show: showToast };

})(window, jQuery);
