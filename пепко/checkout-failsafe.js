(function () {
    var EUR_RATE = 1.95583;
    var DELIVERY_FEES_BGN = {
        office: Number((4 * EUR_RATE).toFixed(2)),
        address: Number((6 * EUR_RATE).toFixed(2))
    };

    function safeParse(value, fallback) {
        try {
            var parsed = JSON.parse(value);
            return parsed == null ? fallback : parsed;
        } catch (e) {
            return fallback;
        }
    }

    function getValue(id, fallback) {
        var el = document.getElementById(id);
        if (!el) return fallback || "";
        var v = (el.value || "").trim();
        return v || (fallback || "");
    }

    function getDelivery() {
        var selected = document.querySelector('input[name="delivery"]:checked');
        return selected ? selected.value : "office";
    }

    function getPaymentMethod() {
        var selected = document.querySelector('input[name="payment-method"]:checked');
        return selected ? selected.value : "cash";
    }

    function buildOrderPayload() {
        var cart = safeParse(localStorage.getItem("cart") || "[]", []);
        if (!Array.isArray(cart) || cart.length === 0) {
            alert("Количката е празна!");
            return null;
        }

        var delivery = getDelivery();
        var paymentMethod = getPaymentMethod();
        var officeSelect = document.getElementById("delivery-office");
        var office = getValue("delivery-office", "");
        var address = getValue("cust-address", "");

        if (delivery === "office" && !office && officeSelect) {
            var firstOffice = officeSelect.querySelector("optgroup option");
            if (firstOffice) {
                office = firstOffice.value;
                officeSelect.value = firstOffice.value;
            }
        }

        if (delivery === "office" && !address) {
            address = office || "Не е посочен офис";
        }

        if (delivery === "address" && !address) {
            address = "Не е посочен адрес";
        }

        var itemsSubtotalBgn = cart.reduce(function (sum, item) {
            return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
        }, 0);
        var deliveryFeeBgn = DELIVERY_FEES_BGN[delivery] || 0;
        var grandTotalBgn = itemsSubtotalBgn + deliveryFeeBgn;

        var customer = {
            name: getValue("cust-name", "Клиент"),
            surname: getValue("cust-surname", "Без фамилия"),
            email: getValue("cust-email", "no-email@placeholder.local"),
            phone: getValue("cust-phone", "Не е посочен телефон"),
            address: address,
            notes: getValue("cust-notes", ""),
            delivery: delivery,
            carrier: getValue("delivery-carrier", "spidi"),
            office: office,
            paymentMethod: paymentMethod,
            itemsSubtotalBgn: itemsSubtotalBgn,
            deliveryFeeBgn: deliveryFeeBgn,
            grandTotalBgn: grandTotalBgn
        };

        return {
            cart: cart,
            customer: customer,
            summary: {
                itemsSubtotalBgn: itemsSubtotalBgn,
                deliveryFeeBgn: deliveryFeeBgn,
                grandTotalBgn: grandTotalBgn
            }
        };
    }

    function saveCompletedOrder(payload) {
        try {
            localStorage.setItem("lastOrder", JSON.stringify(payload.cart));
            localStorage.setItem("lastCustomer", JSON.stringify(payload.customer));
            localStorage.setItem("lastOrderSummary", JSON.stringify(payload.summary));
        } catch (e) {
            console.error("Order save warning:", e);
        }

        try {
            if (typeof window.recordOrder === "function") {
                window.recordOrder(payload.cart);
            }
        } catch (e) {
            console.error("Order history warning:", e);
        }
    }

    function finalizeOrder() {
        var payload = buildOrderPayload();
        if (!payload) return;

        // Актуализиране на складовата наличност
        if (typeof processOrder === 'function') {
            var orderResult = processOrder(payload.cart);
            if (!orderResult.success) {
                alert(orderResult.message);
                return;
            }
        }

        if (payload.customer.paymentMethod === "card") {
            localStorage.setItem("pendingOrder", JSON.stringify(payload));
            window.location.href = "card-payment.html";
            return;
        }

        saveCompletedOrder(payload);
        localStorage.removeItem("pendingOrder");
        localStorage.setItem("cart", "[]");
        alert("Благодарим за поръчката! Ще се свържем с вас скоро.");
        window.location.href = "porachka.html";
    }

    function bindCheckoutButton() {
        var button = document.querySelector(".checkout-btn");
        if (!button) return;
        button.onclick = finalizeOrder;
    }

    window.checkout = finalizeOrder;

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindCheckoutButton);
    } else {
        bindCheckoutButton();
    }
})();
