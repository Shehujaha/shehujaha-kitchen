const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Memory Databases ---
let deliveryAreas = [
    { id: 1, name: "Gidan Shehujaha Core", fee: 200.00, status: true },
    { id: 2, name: "Rano Local Government Secretariat", fee: 350.00, status: true },
    { id: 3, name: "Kano State Metropolitan", fee: 1500.00, status: true }
];

let gatewaySettings = {
    paystackEnabled: true,
    paystackPublicKey: "pk_live_shehujaha_kitchen_987654321",
    stripeEnabled: false
};

let menuItems = [
    { id: 1, name: "Tuwo Shinkafa with Miyan Kuka", category: "Traditional Dishes", price: 1500.00, status: true },
    { id: 2, name: "Special Rano Masa (6 Pieces)", category: "Sides & Extras", price: 600.00, status: true }
];

// --- API Endpoints ---
app.get('/api/delivery-areas', (req, res) => res.json(deliveryAreas));
app.post('/api/delivery-areas', (req, res) => {
    const { name, fee } = req.body;
    const newZone = { id: deliveryAreas.length + 1, name, fee: parseFloat(fee) || 0, status: true };
    deliveryAreas.push(newZone);
    res.status(201).json({ success: true, zone: newZone });
});
app.patch('/api/delivery-areas/:id/toggle', (req, res) => {
    const zone = deliveryAreas.find(z => z.id === parseInt(req.params.id));
    if (zone) zone.status = !zone.status;
    res.json({ success: true, zone });
});

app.get('/api/payments/gateways', (req, res) => res.json(gatewaySettings));
app.post('/api/payments/gateways', (req, res) => {
    gatewaySettings = { ...gatewaySettings, ...req.body };
    res.json({ success: true, settings: gatewaySettings });
});

app.get('/api/menu/items', (req, res) => res.json(menuItems));
app.post('/api/menu/items', (req, res) => {
    const { name, category, price } = req.body;
    const newItem = { id: menuItems.length + 1, name, category, price: parseFloat(price), status: true };
    menuItems.push(newItem);
    res.status(201).json({ success: true, item: newItem });
});
app.patch('/api/menu/items/:id/toggle', (req, res) => {
    const item = menuItems.find(i => i.id === parseInt(req.params.id));
    if (item) item.status = !item.status;
    res.json({ success: true, item });
});

app.post('/api/system/backup', (req, res) => {
    res.json({
        success: true,
        filename: `SHEHUJAHA_KITCHEN_BACKUP_${Date.now()}.sql`,
        size: "4.12 MB",
        created: new Date().toLocaleString()
    });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
    console.log(`🍳 Shehujaha Kitchen Server open at http://localhost:${PORT}`);
});