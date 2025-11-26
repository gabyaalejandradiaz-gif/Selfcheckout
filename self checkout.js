async function fetchProductFromAPI(code) {
    try {
        const res = await fetch(`https://dummyjson.com/products/${code}`);

        if (!res.ok) return null;

        const data = await res.json();

        return {
            name: data.title,
            price: data.price
        };
    } catch (err) {
        return null;
    }
}


/* ============================
   NAVEGACIÓN ENTRE PANTALLAS
=============================== */

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}


/* ============================
   MODALES
=============================== */

function showModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('show');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('show');
}


/* ============================
   FORMULARIO
=============================== */

function handleFormSubmit(e) {
    e.preventDefault();
    showScreen('screen-checkout');
    document.getElementById('productCode').focus();
}


/* ============================
   AGREGAR PRODUCTO (API)
=============================== */

async function addProductByCode() {
    const code = document.getElementById("productCode").value.trim();

    if (!code) return;

    const product = await fetchProductFromAPI(code);

    if (!product) {
        alert("Código no válido o producto no encontrado.");
        return;
    }

    addCartItem(product.name, product.price, code);

    document.getElementById("productCode").value = "";

    updateTotals();
}


/* ============================
   UI: CREAR ITEM EN CARRITO
=============================== */

function addCartItem(name, price, code) {
    const cart = document.getElementById('cartItems');
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.dataset.code = code;

    item.innerHTML = `
        <div class="item-left">
            <div class="item-name">${escapeHtml(name)}</div>
        </div>
        <div class="item-right">
            <div class="item-price">$${price.toFixed(2)}</div>
            <button class="delete-btn" type="button" aria-label="Eliminar">🗑</button>
        </div>
    `;

    cart.appendChild(item);
}


/* ============================
   ESCAPE HTML
=============================== */

function escapeHtml(text) {
    return String(text)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
}


/* ============================
   ELIMINAR ITEMS (delegation)
=============================== */

function cartClickHandler(e) {
    const btn = e.target.closest('.delete-btn');
    if (btn) {
        const item = btn.closest('.cart-item');
        if (item) item.remove();
        updateTotals();
    }
}


/* ============================
   TOTALES
=============================== */

function updateTotals() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;

    items.forEach(i => {
        const pEl = i.querySelector('.item-price');
        const price = pEl ? parseFloat(pEl.textContent.replace('$','')) || 0 : 0;
        subtotal += price;
    });

    const discount = subtotal * 0.20;
    const total = subtotal - discount;

    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('discount').textContent = '-$' + discount.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}


/* ============================
   CANCELAR / RESET
=============================== */

function cancelarCompra() {
    if (confirm('¿Estás seguro de que deseas cancelar la compra?')) resetApp();
}

function resetApp() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    document.getElementById('cartItems').innerHTML = '';
    updateTotals();
    showScreen('screen-welcome');
}


/* ============================
   PAGOS (SIMULADOS)
=============================== */

function handleEfectivo() {
    showModal('modal-efectivo');
    setTimeout(() => {
        closeModal('modal-efectivo');
        showModal('modal-gracias');
    }, 2000);
}

function handleTarjeta() {
    showModal('modal-tarjeta');
    setTimeout(() => {
        closeModal('modal-tarjeta');
        showModal('modal-gracias');
    }, 2000);
}


/* ============================
   BIND UI
=============================== */

function bindUI() {
    const btnCredito = document.getElementById('btnCredito');
    const btnFactura = document.getElementById('btnFactura');

    if (btnCredito) btnCredito.addEventListener('click', () => showModal('modal-credito'));
    if (btnFactura) btnFactura.addEventListener('click', () => showScreen('screen-form'));

    const billingForm = document.getElementById('billingForm');
    if (billingForm) billingForm.addEventListener('submit', handleFormSubmit);

    const addBtn = document.getElementById('addProductBtn');
    if (addBtn) addBtn.addEventListener('click', addProductByCode);

    const codeInput = document.getElementById('productCode');
    if (codeInput) {
        codeInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addProductByCode();
            }
        });
    }

    const cart = document.getElementById('cartItems');
    if (cart) cart.addEventListener('click', cartClickHandler);

    const btnEfectivo = document.getElementById('btnEfectivo');
    if (btnEfectivo) btnEfectivo.addEventListener('click', handleEfectivo);

    const btnTarjeta = document.getElementById('btnTarjeta');
    if (btnTarjeta) btnTarjeta.addEventListener('click', handleTarjeta);

    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) btnCancelar.addEventListener('click', cancelarCompra);

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.target;
            if (t) closeModal(t);
            else document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape')
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    });
}


/* ============================
   INICIO
=============================== */

document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    updateTotals();
});
