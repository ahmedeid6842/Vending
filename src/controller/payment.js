const { updateProductService } = require("../services/product");
const { updateUserService, addOrderToUserService } = require("../services/user");
const { paymentChange } = require("../utils/payment");
const { addDepositValidation } = require("../validators/payment")

module.exports.depositPaymentController = async (req, res) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: validate requst body and verify the coins condition
     * DONE: add deposit value to user collection
     */
    const { error } = addDepositValidation(req.body);
    if (error) return res.status(400).send(error.details);

    req.user.deposit += req.body.amount;
    req.user = await req.user.save();

    return res.status(201).send({ message: "Deposit successful", accountBalance: req.user.deposit });
}




module.exports.buyPaymentController = async (req, res) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: check product's existence for both prodcutID and amount Available and calculate order cost
     * DONE: check if user's deposit is enough for the order or no
     * DONE: subtract order cost from buyer deposit
     * DONE: iterate over the ordered product
     *  DONE: add product cost to seller deposit
     *  DONE: subtract product's amount availble from product's ordered quantity
     * DONE: add order to the buyer embeded order order collection 
     *  DONE: destructure orderTotalCost while you add the order
     */

    if (req.user.deposit < req.orderTotalCost) {
        return res.status(400).send({ path: 'deposit', message: `your order totla cost exceed your deposit ${req.user.deposit}, you need to pay more` })
    }

    req.user.deposit -= req.orderTotalCost;
    await updateUserService({ _id: req.user._id }, { $inc: { deposit: -req.orderTotalCost } })

    for (product of req.orderedProducts) {
        await updateUserService({ _id: product.sellerID }, { $inc: { deposit: product.totalCost } })
        await updateProductService({ _id: product._id }, { $inc: { amountAvailable: -product.quantity } })
    }

    let order = req.orderedProducts.map(product => {
        const { _doc, totalCost, quantity } = product;
        return { ..._doc, totalCost, quantity };
    });

    await addOrderToUserService(req.user._id, order);

    let remainingChange = paymentChange(req.user.deposit);
    return res.status(201).send({ message: "ordered succesfully", order, orderTotalCost: req.orderTotalCost, remainingChange })
}

module.exports.resetPaymentController = async (req, res) => {
    /**
     * DONE: user must be authenticated with buyer role
     * DONE: if there is deposit in coins [5,10,..100]
     * DONE: set the user deposit to zero
     */
    let remainingChange = paymentChange(req.user.deposit);

    await updateUserService({ _id: req.user._id }, { $set: { deposit: 0 } });

    return res.status(201).send({ message: "your deposit reset succesfull", remainingChange });
}