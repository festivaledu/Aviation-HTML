const errorIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><path d="M13.416 4.417a2.002 2.002 0 0 0-2.832 0l-6.168 6.167a2.002 2.002 0 0 0 0 2.833l6.168 6.167a2.002 2.002 0 0 0 2.832 0l6.168-6.167a2.002 2.002 0 0 0 0-2.833l-6.168-6.167z" fill="currentColor"></path><path d="M12 14a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1m0 3a1 1 0 0 1 0-2 1 1 0 0 1 0 2" fill="inherit"></path></g></svg>';
const infoIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><path d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2 2 6.477 2 12z" fill="currentColor"></path><rect fill="inherit" x="11" y="10" width="2" height="7" rx="1"></rect><circle fill="inherit" cx="12" cy="8" r="1"></circle></g></svg>';
const questionIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"></circle><circle fill="inherit" cx="12" cy="18" r="1"></circle><path d="M15.89 9.05a3.975 3.975 0 0 0-2.957-2.942C10.321 5.514 8.017 7.446 8 9.95l.005.147a.992.992 0 0 0 .982.904c.552 0 1-.447 1.002-.998a2.004 2.004 0 0 1 4.007-.002c0 1.102-.898 2-2.003 2H12a1 1 0 0 0-1 .987v2.014a1.001 1.001 0 0 0 2.004 0v-.782c0-.217.145-.399.35-.472A3.99 3.99 0 0 0 15.89 9.05" fill="inherit"></path></g></svg>';
const successIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><circle fill="currentColor" cx="12" cy="12" r="10"></circle><path d="M9.707 11.293a1 1 0 1 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 1 0-1.414-1.414L11 12.586l-1.293-1.293z" fill="inherit"></path></g></svg>';
const warningIcon = '<svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><g fill-rule="evenodd"><path d="M12.938 4.967c-.518-.978-1.36-.974-1.876 0L3.938 18.425c-.518.978-.045 1.771 1.057 1.771h14.01c1.102 0 1.573-.797 1.057-1.771L12.938 4.967z" fill="currentColor"></path><path d="M12 15a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1m0 3a1 1 0 0 1 0-2 1 1 0 0 1 0 2" fill="inherit"></path></g></svg>';

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
            }
        });
    });
}