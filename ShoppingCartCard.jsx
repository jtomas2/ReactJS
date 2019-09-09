import React from "react";
import PropTypes from "prop-types";
import logger from "sabio-debug";
const _logger = logger.extend("ShoppingCartCard");

const ShoppingCartCard = props => {
  let couponCode = React.createRef();

  const handleDelete = () => {
    props.deleteShoppingCart(props.shoppingCart.id);
  };

  const handleUpdate = () => {
    props.updateShoppingCart(props.shoppingCart);
  };

  const cartQuantity = evt => {
    props.handleUpdateCardQuantity(props.shoppingCart, evt);
  };

  const applyCoupon = () => {
    debugger;
    let code = couponCode.current.value;
    _logger(code);
    props.applyCouponToCart(props.shoppingCart, code);
  };

  return (
    <React.Fragment>
      <div
        className="row border-bottom justify-content-between"
        style={{
          paddingRight: "2rem",
          paddingTop: "2rem",
          paddingBottom: "1rem"
        }}
      >
        {" "}
        <div className="col-md-12" style={{ display: "inline-flex" }}>
          <div
            className="col-md-3"
            style={{
              marginRight: "20px",
              display: "inline-block",
              paddingRight: "1rem"
            }}
          >
            <img
              src={props.shoppingCart.product.primaryImage}
              alt="itemPic"
              style={{ width: "200px", height: "auto" }}
              className="imgItem"
            />
          </div>
          <div
            className="col-lg-9 justify-content-center"
            style={{ display: "inline-block" }}
          >
            <div className="header row border-bottom">
              <h2 className="col-md-10">
                {props.shoppingCart.product.year}{" "}
                {props.shoppingCart.product.manufacturer}{" "}
                {props.shoppingCart.product.name}
              </h2>
              <div className="col-md-2">
                <a
                  style={{ cursor: "pointer", color: "green" }}
                  className="float-right"
                  onClick={handleUpdate}
                >
                  <strong>Update</strong>
                </a>
              </div>
            </div>
            <div className="body">
              <div className="form-group row">
                <div className="col-md-6">
                  <div
                    className="row"
                    style={{ paddingBottom: "1rem", paddingTop: "1rem" }}
                  >
                    <label className="col-md-4 col-form-label">Quantity</label>
                    <div className="col-md-6">
                      <select
                        type="select"
                        onChange={cartQuantity}
                        value={props.shoppingCart.quantity}
                      >
                        {props.quantityItems}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <label className="col-md-4 col-form-label">Promo</label>
                    <div className="col-md-8">
                      <input
                        onBlur={applyCoupon}
                        ref={couponCode}
                        type="text"
                        className="form-control"
                        placeholder="Enter Promo Code"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="row justify-content-end"
                    style={{ paddingTop: "1rem" }}
                  >
                    <label className="bold" style={{ paddingRight: "2rem" }}>
                      <strong>Price:</strong>
                    </label>
                    <h3 className="price">
                      <strong>
                        $
                        {props.shoppingCart.inventory.basePrice *
                          props.shoppingCart.quantity}
                      </strong>
                    </h3>
                  </div>
                  <div
                    className="row justify-content-end"
                    style={{ paddingBottom: "1px" }}
                  >
                    <div className="text-right">
                      <strong>SKU:{props.shoppingCart.product.sku}</strong>
                    </div>
                  </div>
                  <div style={{ paddingTop: "1rem" }}>
                    <div
                      className="row justify-content-end"
                      style={{ paddingBottom: "1rem" }}
                    >
                      <em
                        name="delete"
                        style={{ cursor: "pointer" }}
                        className="fa-1x mr-2 far fa-trash-alt text-right"
                        onClick={handleDelete}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

ShoppingCartCard.propTypes = {
  shoppingCart: PropTypes.shape({
    id: PropTypes.number.isRequired,
    inventoryId: PropTypes.number.isRequired,
    product: PropTypes.object.isRequired,
    inventory: PropTypes.object.isRequired,
    quantity: PropTypes.number.isRequired
  }),
  deleteShoppingCart: PropTypes.func.isRequired,
  updateShoppingCart: PropTypes.func.isRequired,
  handleUpdateCardQuantity: PropTypes.func.isRequired,
  applyCouponToCart: PropTypes.func.isRequired,
  quantityItems: PropTypes.array
};

export default ShoppingCartCard;
