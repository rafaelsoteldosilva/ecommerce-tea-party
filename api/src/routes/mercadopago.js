const { Router } = require("express");
const router = Router();

const mercadopago = require("mercadopago");
const Order = require("../db.js");

const { MP_TOKEN } = process.env;

mercadopago.configure({
  access_token: MP_TOKEN,
});

router.post("/create_preference", async (req, res, next) => {
  const { orderId } = req.query;

  //Traemos la orden creada
  // const orderMP = await Order.findOne({
  //   where: {
  //     id: orderId,
  //   },
  //   include: {
  //     all: true,
  //   },
  // });

  let preference = {
    items: [
      {
        //id: NOS DEBERIA LLEGAR UN ORDERID
        title: "Compra en Té Quiero",
        quantity: 1,
        currency_id: "ARS",
        unit_price: req.body.totalprice,
      },
    ],
    back_urls: {
      success: "http://localhost:3000/?status=approved",
      failure: "http://localhost:3000/?status=rejected",
      pending: "http://localhost:3000/?status=in_process",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then(function (response) {
      // Este valor reemplaza el string "<%= global.id %>" en el HTML
      globalurl = response.body.init_point;
      console.log("asdasdsdadas", globalurl);
      res.send(globalurl);
    })
    .catch(function (error) {
      console.log(error);
    });
});

module.exports = router;
