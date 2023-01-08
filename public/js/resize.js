const minPortraitRatio = 1.75;
const maxPortraitRatio = 2.67;
const maxLandscapeRatio = 0.56;
const ua = window.navigator.userAgent;
var isMobile = false;
var gameFrame;
var gameIFrame;
window.onload = function() {
    defineDevice();
    passAllParameters();
    passPostMessageEvents();
    if (!isDesktop()) {
        doResize();
        window.addEventListener("resize", debounce(function() {
            doResize();
        }, 250));
        window.addEventListener("orientationchange", debounce(function() {
            doResize();
        }, 250));
    }
};

function doResize() {
    const innerWidth = document.documentElement.clientWidth;
    const innerHeight = document.documentElement.clientHeight;
    const ratio = innerHeight / innerWidth;
    /**
     * Do frame resize only for mobile portrait
     */
    if (innerWidth < innerHeight) {
        /**
         * Do not go beyond the min or max ratios. If it does, then the frame will resize proportionally and center.
         */
        if (ratio < minPortraitRatio && isMobile) {
            // h / w = r
            const width = (100 * ratio / minPortraitRatio);
            setFrameDimensions(gameFrame, width, 100);
            gameFrame.style.left = ((100 - width) / 2).toPrecision(4) + "%";
            gameFrame.style.top = "0";
        } else if (ratio > maxPortraitRatio && isMobile) {
            const height = (100 * maxPortraitRatio / ratio);
            setFrameDimensions(gameFrame, 100, height);
            gameFrame.style.top = ((100 - height) / 2).toPrecision(4) + "%";
            gameFrame.style.left = "0";
        } else {
            setFrameDimensions(gameFrame, 100, 100);
            gameFrame.style.left = "0";
            gameFrame.style.top = "0";
        }
        /**
         * Limit of height for iOS portrait enter\exit fullscreen
         */
        gameFrame.style.maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight) + "px";
    } else {
        if (ratio > maxLandscapeRatio) {
            const height = (100 * maxLandscapeRatio / ratio);
            setFrameDimensions(gameFrame, 100, height);
            gameFrame.style.top = ((100 - height) / 2).toPrecision(4) + "%";
            gameFrame.style.left = "0";
        } else {
            setFrameDimensions(gameFrame, 100, 100);
            gameFrame.style.left = "0";
            gameFrame.style.top = "0";
        }
        /**
         * Limit of height for iOS landscape enter\exit fullscreen
         */
        gameFrame.style.maxHeight = Math.min(document.documentElement.clientHeight, window.innerHeight) + "px";
    }
    /**
     * Reset scroll position, iOS enter\exit fullscreen fix
     */
    if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
    }
}

function setFrameDimensions(frame, width, height) {
    gameFrame.width = width.toPrecision(4) + "%";
    gameFrame.style.width = width.toPrecision(4) + "%";
    gameFrame.height = height.toPrecision(4) + "%";
    gameFrame.style.height = height.toPrecision(4) + "%";
}

function isDesktop() {
    return getDeviceType() === "desktop";
}

function isMobileUA() {
    return getDeviceType() !== "desktop";
}

function getDeviceType() {
    const tabletRegExp = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i;
    const mobileRegExp =
        /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/;
    if (tabletRegExp.test(navigator.userAgent)) {
        return "tablet";
    }
    if (mobileRegExp.test(navigator.userAgent)) {
        return "mobile";
    }
    return "desktop";
}

function passPostMessageEvents() {
    window.addEventListener("message", function(event) {
        /**
         * If the event is coming from the same origin and it's from game side, then it's forwarded to the proper place
         */
        if (event.origin.replace(/(^\w+:|^)\/\//, "") == document.location.host
            && event.source.location.pathname.indexOf("_game.html") > -1) {
            window.parent.postMessage(event.data, "*");
        } else {
            gameIFrame.contentWindow.postMessage(event.data, "*");
        }
    });
}

function passAllParameters() {
    let gameLink = gameIFrame.getAttribute("data-game-link");
    let baseURI = document.baseURI;
    if (!baseURI) {
        const baseTags = document.getElementsByTagName("base");
        baseURI = baseTags.length ? baseTags[0].href : document.URL;
    }
    let params = baseURI.split(".html?");
    if (params && params.length > 1) {
        gameLink += "?" + params.slice(1).join(".html?");
    }
    gameIFrame.src = gameLink;
}

function defineDevice() {
    gameFrame = document.getElementById("gameFrame");
    gameIFrame = document.getElementById("gameiframe");
    if (isMobileUA()) {
        isMobile = true;
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        let context = this;
        let args = arguments;
        let later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}
