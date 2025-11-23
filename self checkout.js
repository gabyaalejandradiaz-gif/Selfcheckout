/* App JS separado en funciones */

const PRODUCTS = {
    '1001': { name: 'Leche descremada', price: 3.00 },
    '1002': { name: 'Manzana Fiji', price: 0.60 },
    '1003': { name: 'Pepino Ingles', price: 0.80 },
    '1004': { name: 'Tomate de ensalada', price: 0.70 },
    '1005': { name: 'Yogurt natural 1 L', price: 2.90 },
    '1006': { name: 'Bananas (1 lb)', price: 0.85 },
    '1007': { name: 'Zanahoria (1 lb)', price: 0.75 },
    '1008': { name: 'Cereal integral 300 g', price: 3.40 },
    '1009': { name: 'Arroz blanco 2 lb', price: 2.25 },
    '1010': { name: 'Frijoles rojos 2 lb', price: 2.40 },
    '1011': { name: 'Aceite de oliva 500 ml', price: 5.90 },
    '1012': { name: 'Galletas saladas 6 pack', price: 1.50 },
    '1013': { name: 'Jugo de naranja 1 L', price: 2.20 },
    '1014': { name: 'Papel higiénico (paquete de 4)', price: 2.10 },
    '1015': { name: 'Detergente líquido 1 L', price: 4.80 },
    '1016': { name: 'Queso cheddar 200 g', price: 3.75 }
};

/* Navegación entre pantallas */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

/* Modales */
function showModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('show');
}
function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove('show');
}

/* Formulario */
function handleFormSubmit(e) {
    e.preventDefault();
    showScreen('screen-checkout');
    document.getElementById('productCode').focus();
}

/* Carrito */
function addProductByCode() {
    const input = document.getElementById('productCode');
    const raw = (input.value || '').trim();
    if (!raw) return;
    const code = raw.split(/[^0-9]/)[0];
    const product = PRODUCTS[code];
    if (!product) {
        alert('Código no encontrado: ' + raw);
        input.value = '';
        input.focus();
        return;
    }
    addCartItem(product.name, product.price, code);
    input.value = '';
    input.focus();
    updateTotals();
}

function addCartItem(name, price, code) {
    const cart = document.getElementById('cartItems');
    const item = document.createElement('div');
    item.className = 'cart-item';
    item.dataset.code = code || '';
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

/* Escapar texto para innerHTML */
function escapeHtml(text) {
    return String(text)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
}

/* Delegation para eliminar y otras acciones */
function cartClickHandler(e) {
    const btn = e.target.closest('.delete-btn');
    if (btn) {
        const item = btn.closest('.cart-item');
        if (item) item.remove();
        updateTotals();
    }
}

/* Totales */
function updateTotals() {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    items.forEach(i => {
        const pEl = i.querySelector('.item-price');
        const price = pEl ? parseFloat(pEl.textContent.replace('$','')) || 0 : 0;
        subtotal += price;
    });
    const discount = subtotal * 0.2;
    const total = subtotal - discount;
    document.getElementById('subtotal').textContent = '$' + subtotal.toFixed(2);
    document.getElementById('discount').textContent = '-$' + discount.toFixed(2);
    document.getElementById('total').textContent = '$' + total.toFixed(2);
}

/* Cancelar / reset */
function cancelarCompra() {
    if (confirm('¿Estás seguro de que deseas cancelar la compra?')) resetApp();
}
function resetApp() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
    document.getElementById('cartItems').innerHTML = '';
    updateTotals();
    showScreen('screen-welcome');
}

/* Pagos (simulados) */
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

/* Eventos globales */
function bindUI() {
    document.getElementById('btnCredito').addEventListener('click', () => showModal('modal-credito'));
    document.getElementById('btnFactura').addEventListener('click', () => showScreen('screen-form'));
    document.getElementById('billingForm').addEventListener('submit', handleFormSubmit);

    document.getElementById('addProductBtn').addEventListener('click', addProductByCode);
    document.getElementById('productCode').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); addProductByCode(); }
    });

    document.getElementById('cartItems').addEventListener('click', cartClickHandler);

    document.getElementById('btnEfectivo').addEventListener('click', handleEfectivo);
    document.getElementById('btnTarjeta').addEventListener('click', handleTarjeta);
    document.getElementById('btnCancelar').addEventListener('click', cancelarCompra);

    // Cerrar modales con botones que usan data-target
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = btn.dataset.target;
            if (t) closeModal(t);
            else document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
        });
    });

    // ESC cierra modales
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show')); });
}

/* Inicialización */
document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    updateTotals();
});