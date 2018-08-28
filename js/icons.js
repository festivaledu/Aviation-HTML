const errorIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><path d="M13.416 4.417a2.002 2.002 0 0 0-2.832 0l-6.168 6.167a2.002 2.002 0 0 0 0 2.833l6.168 6.167a2.002 2.002 0 0 0 2.832 0l6.168-6.167a2.002 2.002 0 0 0 0-2.833l-6.168-6.167z" fill="currentColor"></path><path d="M12 14a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1m0 3a1 1 0 0 1 0-2 1 1 0 0 1 0 2" fill="inherit"></path></g></svg>';
const infoIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" fill="currentColor"></path><rect fill="inherit" x="11" y="10" width="2" height="7" rx="1"></rect><circle fill="inherit" cx="12" cy="8" r="1"></circle></g></svg>';
const questionIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"></circle><circle fill="inherit" cx="12" cy="18" r="1"></circle><path d="M15.89 9.05a3.975 3.975 0 0 0-2.957-2.942C10.321 5.514 8.017 7.446 8 9.95l.005.147a.992.992 0 0 0 .982.904c.552 0 1-.447 1.002-.998a2.004 2.004 0 0 1 4.007-.002c0 1.102-.898 2-2.003 2H12a1 1 0 0 0-1 .987v2.014a1.001 1.001 0 0 0 2.004 0v-.782c0-.217.145-.399.35-.472A3.99 3.99 0 0 0 15.89 9.05" fill="inherit"></path></g></svg>';
const successIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"></circle><path d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z" fill="inherit"></path></g></svg>';
const warningIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><path d="M12.938 4.967c-.518-.978-1.36-.974-1.876 0L3.938 18.425c-.518.978-.045 1.771 1.057 1.771h14.01c1.102 0 1.573-.797 1.057-1.771L12.938 4.967z" fill="currentColor"></path><path d="M12 15a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1m0 3a1 1 0 0 1 0-2 1 1 0 0 1 0 2" fill="inherit"></path></g></svg>';
const refreshIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill="currentColor" fill-rule="evenodd"><path d="M8 6.003v2.995a1 1 0 1 0 2 0V5.102C10 4.494 9.507 4 8.9 4H5a1 1 0 0 0 0 2.003h3z" fill-rule="nonzero"></path><path d="M9.428 18.018C7.351 16.989 6 14.807 6 12.37c0-2.266 1.167-4.319 3.02-5.425.48-.286.646-.922.371-1.421a.979.979 0 0 0-1.364-.386C5.557 6.611 4 9.35 4 12.37c0 3.248 1.802 6.158 4.57 7.529.498.247 1.095.026 1.332-.493.237-.52.025-1.141-.474-1.388z" fill-rule="nonzero"></path><path d="M14 15.002v3.896c0 .608.493 1.102 1.1 1.102H19a1 1 0 0 0 0-2.003h-3v-2.995a1 1 0 1 0-2 0z"></path><path d="M14.097 4.596c-.237.52-.025 1.14.474 1.387 2.077 1.029 3.428 3.21 3.428 5.647 0 2.266-1.167 4.32-3.021 5.425a1.063 1.063 0 0 0-.37 1.42c.274.5.885.673 1.364.387 2.47-1.473 4.027-4.212 4.027-7.232 0-3.248-1.802-6.158-4.57-7.528A.957.957 0 0 0 15.002 4a1 1 0 0 0-.905.596z"></path></g></svg>';
const deleteIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M5 5a1 1 0 0 0-1 1v1h16V6a1 1 0 0 0-1-1H5zm11.15 15H7.845a1 1 0 0 1-.986-.835L5 8h14l-1.864 11.166a.999.999 0 0 1-.986.834M9 4.5a.5.5 0 0 1 .491-.5h5.018a.5.5 0 0 1 .491.5V5H9v-.5z" fill="currentColor" fill-rule="evenodd"></path></svg>';
const checkIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M6.735 12.322a1 1 0 0 0-1.47 1.356l3.612 3.919c.537.526 1.337.526 1.834.03l.364-.359a2335.638 2335.638 0 0 0 3.939-3.883l.04-.04a492.598 492.598 0 0 0 3.658-3.643 1 1 0 0 0-1.424-1.404 518.42 518.42 0 0 1-3.64 3.625l-.04.04a2049.114 2049.114 0 0 1-3.775 3.722l-3.098-3.363z" fill="currentColor"></path></svg>';
const plusIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M13 11V3.993A.997.997 0 0 0 12 3c-.556 0-1 .445-1 .993V11H3.993A.997.997 0 0 0 3 12c0 .557.445 1 .993 1H11v7.007c0 .548.448.993 1 .993.556 0 1-.445 1-.993V13h7.007A.997.997 0 0 0 21 12c0-.556-.445-1-.993-1H13z" fill="currentColor" fill-rule="evenodd"></path></svg>';

if (document.querySelectorAll("span.ai")) {
    document.querySelectorAll("span.ai").forEach(el => {
        const modifiers = el.className.split(" ").filter(c => c.startsWith("ai-")).map(c => c.substring(3));

        modifiers.forEach(m => {
            switch (m) {
                case "error":
                    el.outerHTML = errorIcon;
                    break;
                case "info":
                    el.outerHTML = infoIcon;
                    break;
                case "question":
                    el.outerHTML = questionIcon;
                    break;
                case "success":
                    el.outerHTML = successIcon;
                    break;
                case "warning":
                    el.outerHTML = warningIcon;
                    break;
                case 'refresh':
                    el.outerHTML = refreshIcon;
                    break;
                case 'delete':
                    el.outerHTML = deleteIcon;
                    break;
                case 'check':
                    el.outerHTML = checkIcon;
                    break;
                case 'plus':
                    el.outerHTML = plusIcon;
                    break;
            }
        });
    });
}