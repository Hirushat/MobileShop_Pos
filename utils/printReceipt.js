const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const { Order, OrderItem, Product, Customer, Repair } = require("../models");

async function printReceipt(type, id) {
    try {
        let printer = new ThermalPrinter({
            type: PrinterTypes.EPSON,
            interface: "USB",
            characterSet: "SLOVENIA",
            removeSpecialCharacters: false,
            lineCharacter: "="
        });

        printer.alignCenter();
        printer.println("📍 MOBILE SHOP POS");
        printer.println(`📅 ${new Date().toLocaleDateString()}`);
        printer.drawLine();

        if (type === "order") {
            const order = await Order.findByPk(id, {
                include: [{ model: OrderItem, include: [Product] }, Customer]
            });

            if (!order) {
                console.error("❌ Order not found.");
                return;
            }

            printer.println(`🛍️ Order ID: ${order.id}`);
            printer.println(`👤 Customer: ${order.Customer ? order.Customer.name : "Walk-in"}`);
            printer.drawLine();

            order.OrderItems.forEach((item) => {
                printer.println(`${item.Product.name} x${item.quantity}`);
                printer.println(`Rs. ${item.price.toFixed(2)}  |  Total: Rs. ${(item.price * item.quantity).toFixed(2)}`);
                printer.newLine();
            });

            printer.drawLine();
            printer.bold(true);
            printer.println(`Total: Rs. ${order.totalAmount.toFixed(2)}`);
            printer.bold(false);
            printer.println(`Payment: ${order.paymentMethod}`);
            printer.drawLine();
            printer.println("👋 Thank You! Come Again!");

        } else if (type === "repair") {
            const repair = await Repair.findByPk(id);

            if (!repair) {
                console.error("❌ Repair not found.");
                return;
            }

            printer.println(`🛠️ Repair ID: ${repair.id}`);
            printer.println(`📞 Mobile Number: ${repair.mobile_number}`);
            printer.println(`👤 Customer: ${repair.customer_name}`);
            printer.println(`Issue: ${repair.issue_description}`);
            printer.println(`Technician: ${repair.technician_name || "N/A"}`);
            printer.println(`Status: ${repair.repair_status}`);
            printer.println(`Cost: Rs. ${repair.repair_cost.toFixed(2)}`);
            printer.drawLine();
            printer.println("👋 Thank You! Visit Again!");
        }

        printer.cut();
        let execute = await printer.execute();
        console.log("🖨️ Receipt printed successfully", execute);
    } catch (error) {
        console.error("❌ Error printing receipt:", error);
    }
}

module.exports = printReceipt;
