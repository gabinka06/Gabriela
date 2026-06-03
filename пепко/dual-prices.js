(function () {
    var EUR_RATE = 1.95583;
    var scheduled = false;

    function toNumber(value) {
        var match = String(value || "").match(/\d+(?:[\.,]\d+)?/);
        return match ? Number(match[0].replace(",", ".")) : 0;
    }

    function formatDualPrice(amount) {
        var bgn = Number(amount) || 0;
        var eur = bgn / EUR_RATE;
        return bgn.toFixed(2) + " лв / €" + eur.toFixed(2);
    }

    function formatProductPrices() {
        document.querySelectorAll(".product-price").forEach(function (element) {
            var stored = element.getAttribute("data-bgn-price");
            var amount = stored ? Number(stored) : toNumber(element.textContent);
            if (!stored) {
                element.setAttribute("data-bgn-price", amount.toFixed(2));
            }
            var nextText = formatDualPrice(amount);
            if (element.textContent.trim() !== nextText) {
                element.textContent = nextText;
            }
        });
    }

    function formatDualPriceElements() {
        document.querySelectorAll(".dual-price").forEach(function (element) {
            var stored = element.getAttribute("data-bgn-price");
            var amount = stored ? Number(stored) : toNumber(element.textContent);
            element.setAttribute("data-bgn-price", amount.toFixed(2));

            var nextText = formatDualPrice(amount);
            if (element.textContent.trim() !== nextText) {
                element.textContent = nextText;
            }
        });
    }

    function formatCartLinePrices() {
        document.querySelectorAll(".cart-item-price").forEach(function (element) {
            var text = element.textContent || "";
            var match = text.match(/(\d+(?:[\.,]\d+)?)\s*лв(?:\s*x\s*(\d+))?/i);
            if (!match) return;
            var amount = Number(match[1].replace(",", "."));
            var quantity = match[2] ? " x " + match[2] : "";
            var nextText = formatDualPrice(amount) + quantity;
            if (element.textContent.trim() !== nextText) {
                element.textContent = nextText;
            }
        });

        document.querySelectorAll(".cart-item-total").forEach(function (element) {
            var amount = toNumber(element.textContent);
            var nextText = formatDualPrice(amount);
            if (element.textContent.trim() !== nextText) {
                element.textContent = nextText;
            }
        });
    }

    function formatCartTotals() {
        var totalElement = document.getElementById("cart-total");
        if (!totalElement) return;

        var amount = totalElement.getAttribute("data-bgn-price");
        amount = amount ? Number(amount) : toNumber(totalElement.textContent);
        totalElement.setAttribute("data-bgn-price", amount.toFixed(2));

        var formatted = formatDualPrice(amount);
        var parent = totalElement.parentElement;

        if (parent && parent.tagName === "STRONG") {
            var desired = 'Общо: <span id="cart-total" data-bgn-price="' + amount.toFixed(2) + '">' + formatted + '</span>';
            if (parent.innerHTML !== desired) {
                parent.innerHTML = desired;
            }
            return;
        }

        if (totalElement.textContent.trim() !== formatted) {
            totalElement.textContent = formatted;
        }
    }

    function renderAllDualPrices() {
        formatProductPrices();
        formatDualPriceElements();
        formatCartLinePrices();
        formatCartTotals();
    }

    function scheduleRender() {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(function () {
            scheduled = false;
            renderAllDualPrices();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", scheduleRender);
    } else {
        scheduleRender();
    }

    var observer = new MutationObserver(function () {
        scheduleRender();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        characterData: true
    });

    window.formatDualPrice = formatDualPrice;
})();
