export function smoothScrollTo(top: number, el = document.body, left = 0) {
    var isSmoothScrollSupported = 'scrollBehavior' in el.style;
    var options = {
        behavior: 'smooth',
        left: left,
        top: top
    } as any;
    if (isSmoothScrollSupported) {
        el.scrollTo(options);
    }
    else {
        el.scrollTop = top;
        el.scrollLeft = left;
    }
}