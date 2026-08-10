// simple custom cursor with magnetic and morph modes
const DEFAULT_SELECTOR = "[data-cursor], a, button";

export function createCursor(options = {}) {
    // stop if the device does not support fine pointer input
    if (
        typeof window === "undefined" ||
        typeof document === "undefined"
    ) {
        return null;
    }

    if (
        window.matchMedia("(hover: none), (pointer: coarse)").matches
    ) {
        return null;
    }

    // prevent multiple cursor instances
    if (document.querySelector(".cursor")) {
        return null;
    }

    const selector = options.selector || DEFAULT_SELECTOR;

    // create the cursor element
    const cursor = document.createElement("div");
    cursor.className = "cursor";
    document.body.appendChild(cursor);

    // create the label element
    const label = document.createElement("span");
    label.className = "cursor-label";
    cursor.appendChild(label);

    // mark the page as using the custom cursor
    document.documentElement.classList.add("has-custom-cursor");

    // mouse and animation state
    const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };

    const position = {
        x: mouse.x,
        y: mouse.y
    };

    const magnetic = {
        x: mouse.x,
        y: mouse.y
    };

    let activeElement = null;
    let cursorWidth = 14;
    let cursorHeight = 14;
    let targetWidth = 14;
    let targetHeight = 14;
    let isAnimating = false;
    let rafId = null;

    // check if an element should trigger the cursor
    function getInteractiveTarget(element) {
        if (
            !element ||
            element === document ||
            element === document.body
        ) {
            return null;
        }

        if (element.matches?.(selector)) {
            return element;
        }

        return element.closest?.(selector);
    }

    // decide if the animation loop should keep running
    function needsAnimation() {
        const positionDiff =
            Math.abs(magnetic.x - position.x) > 0.1 ||
            Math.abs(magnetic.y - position.y) > 0.1;

        const sizeDiff =
            Math.abs(targetWidth - cursorWidth) > 0.1 ||
            Math.abs(targetHeight - cursorHeight) > 0.1;

        return (
            positionDiff ||
            sizeDiff ||
            activeElement !== null
        );
    }

    function startAnimation() {
        if (isAnimating) return;

        isAnimating = true;
        rafId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        isAnimating = false;

        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // activate a mode when entering an interactive element
    function activateElement(element) {
        if (!element || activeElement === element) {
            return;
        }

        activeElement = element;

        const type = element.dataset.cursor || "default";

        cursor.classList.remove(
            "is-hovering",
            "is-magnetic",
            "is-morph"
        );

        if (
            type === "magnetic" ||
            type === "morph" ||
            type === "magnetic-morph"
        ) {
            cursor.classList.add("is-magnetic");
        }

        if (
            type === "morph" ||
            type === "magnetic-morph"
        ) {
            cursor.classList.add("is-morph");

            const rect = element.getBoundingClientRect();

            targetWidth = rect.width + 8;
            targetHeight = rect.height + 8;

            const computed = getComputedStyle(element);
            const radius =
                parseFloat(computed.borderRadius) || 0;

            const targetRadius =
                Math.min(radius + 4, 40);

            cursor.style.setProperty(
                "--cursor-radius",
                targetRadius + "px"
            );

            const cursorText =
                element.dataset.cursorText;

            label.textContent = cursorText || "";
        } else {
            cursor.classList.add("is-hovering");

            targetWidth = 14;
            targetHeight = 14;

            label.textContent = "";
        }

        startAnimation();
    }

    // reset the cursor when leaving an interactive element
    function deactivateElement() {
        if (!activeElement) {
            return;
        }

        activeElement = null;

        cursor.classList.remove(
            "is-hovering",
            "is-magnetic",
            "is-morph"
        );

        targetWidth = 14;
        targetHeight = 14;

        label.textContent = "";

        cursor.style.setProperty(
            "--cursor-radius",
            "50%"
        );

        startAnimation();
    }

    // pull the cursor toward the active element when needed
    function updateMagnetism() {
        if (!activeElement) {
            magnetic.x = mouse.x;
            magnetic.y = mouse.y;
            return;
        }

        const type =
            activeElement.dataset.cursor || "default";

        if (
            type !== "magnetic" &&
            type !== "morph" &&
            type !== "magnetic-morph"
        ) {
            magnetic.x = mouse.x;
            magnetic.y = mouse.y;
            return;
        }

        const rect =
            activeElement.getBoundingClientRect();

        const centerX =
            rect.left + rect.width / 2;

        const centerY =
            rect.top + rect.height / 2;

        if (type === "magnetic") {
            const force = 0.78;

            const targetX =
                mouse.x +
                (centerX - mouse.x) * force;

            const targetY =
                mouse.y +
                (centerY - mouse.y) * force;

            magnetic.x +=
                (targetX - magnetic.x) * 0.18;

            magnetic.y +=
                (targetY - magnetic.y) * 0.18;

            return;
        }

        // morph and magnetic-morph stay mostly locked to the element
        const follow = 0.035;

        const targetX =
            centerX +
            (mouse.x - centerX) * follow;

        const targetY =
            centerY +
            (mouse.y - centerY) * follow;

        magnetic.x +=
            (targetX - magnetic.x) * 0.2;

        magnetic.y +=
            (targetY - magnetic.y) * 0.2;
    }

    // main animation loop
    function animate() {
        updateMagnetism();

        position.x +=
            (magnetic.x - position.x) * 0.22;

        position.y +=
            (magnetic.y - position.y) * 0.22;

        cursorWidth +=
            (targetWidth - cursorWidth) * 0.16;

        cursorHeight +=
            (targetHeight - cursorHeight) * 0.16;

        cursor.style.transform =
            "translate3d(" +
            position.x +
            "px, " +
            position.y +
            "px, 0) translate3d(-50%, -50%, 0)";

        cursor.style.width =
            cursorWidth + "px";

        cursor.style.height =
            cursorHeight + "px";

        if (needsAnimation()) {
            rafId = requestAnimationFrame(animate);
        } else {
            stopAnimation();
        }
    }

    // track mouse movement
    function handleMouseMove(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;

        cursor.classList.remove("is-hidden");

        startAnimation();
    }

    // detect interactive elements with event delegation
    function handleMouseOver(event) {
        const target =
            getInteractiveTarget(event.target);

        if (target) {
            activateElement(target);
        }
    }

    function handleMouseOut(event) {
        const target =
            getInteractiveTarget(event.target);

        const related =
            getInteractiveTarget(event.relatedTarget);

        if (target && target !== related) {
            deactivateElement();
        }
    }

    // hide the cursor when the mouse leaves the window
    function handleMouseLeave() {
        cursor.classList.add("is-hidden");
        deactivateElement();
    }

    function handleMouseEnter() {
        cursor.classList.remove("is-hidden");
    }

    // track mouse movement
    document.addEventListener(
        "mousemove",
        handleMouseMove
    );

    // detect interactive elements with event delegation
    document.addEventListener(
        "mouseover",
        handleMouseOver
    );

    document.addEventListener(
        "mouseout",
        handleMouseOut
    );

    // hide the cursor when the mouse leaves the window
    document.addEventListener(
        "mouseleave",
        handleMouseLeave
    );

    document.addEventListener(
        "mouseenter",
        handleMouseEnter
    );

    // safety check if the active element is removed from the page
    const observer = new MutationObserver(function () {
        if (
            activeElement &&
            !document.contains(activeElement)
        ) {
            deactivateElement();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // expose a method to remove the cursor
    return {
        destroy() {
            stopAnimation();

            document.removeEventListener(
                "mousemove",
                handleMouseMove
            );

            document.removeEventListener(
                "mouseover",
                handleMouseOver
            );

            document.removeEventListener(
                "mouseout",
                handleMouseOut
            );

            document.removeEventListener(
                "mouseleave",
                handleMouseLeave
            );

            document.removeEventListener(
                "mouseenter",
                handleMouseEnter
            );

            observer.disconnect();

            cursor.remove();

            document.documentElement.classList.remove(
                "has-custom-cursor"
            );
        }
    };
}
