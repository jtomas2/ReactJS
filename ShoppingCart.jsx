import React from "react";
import * as shoppingCartService from "../../services/shoppingCartService";
import * as discountService from "../../services/discountService";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import swal from "sweetalert";
import "./ShoppingCartStyling.css";
import ShoppingCartCardTest2 from "./ShoppingCartCard";

const _logger = logger.extend("shoppingcart");

class ShoppingCart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      inventoryId: "",
      quantity: "",
      quantityItems: [],
      shoppingCarts: [],
      mappedShoppingCarts: [],
      currentPage: 0,
      totalCount: 0,
      pageSize: 10,
      selectedShoppingCardItemToApplyDiscount: {},
      total: 0,
      price: 0
    };
  }

  componentDidMount() {
    this.dropdownOptions();
    this.getAll();
  }
  getAll = () => {
    shoppingCartService
      .getByCurrent(this.state.currentPage, this.state.pageSize)
      .then(this.onGetAllSuccess)
      .catch(this.onGetAllError);
  };

  onGetAllError = errResponse => {
    _logger(errResponse);
    _logger("Error!");
  };

  onGetAllSuccess = response => {
    const pageSize = response.item.pageSize;
    const totalCount = response.item.totalCount;
    const totalPages = response.item.totalPages;
    const shoppingCarts = response.item.pagedItems;

    this.setState(
      {
        shoppingCarts,
        mappedShoppingCarts: shoppingCarts.map(this.mapShoppingCart),
        pageSize: pageSize,
        totalCount: totalCount,
        totalPages: totalPages
      },
      () => this.getTotal()
    );
  };

  handleDelete = id => {
    _logger(id);
    this.deleteShoppingCart(id);
  };

  deleteShoppingCart = id => {
    shoppingCartService
      .deleteById(id)
      .then(this.updateMappedShoppingCart)
      .catch(this.onDeleteError);
  };

  dropdownOptions = () => {
    for (let i = 0; i < 10; i++) {
      this.state.quantityItems.push(
        <option key={i} value={i + 1}>
          {i + 1}
        </option>
      );
    }
  };
  mapShoppingCart = shoppingCart => (
    <ShoppingCartCardTest2
      key={shoppingCart.id}
      shoppingCart={shoppingCart}
      quantityItems={this.state.quantityItems}
      deleteShoppingCart={this.deleteShoppingCart}
      updateShoppingCart={this.updateShoppingCart}
      handleUpdateCardQuantity={this.handleUpdateCardQuantity}
      applyCouponToCart={this.applyCouponToCart}
    />
  );

  onChange = page => {
    _logger(page, "a message");

    this.setState(
      {
        currentPage: page - 1
      },
      () => this.getAll()
    );
  };

  deleteShoppingCart = id => {
    swal({
      title: "Remove Item From Cart?",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(willDelete => {
      if (willDelete) {
        shoppingCartService
          .deleteById(id)
          .then(this.onDeleteSuccess)
          .catch(this.onDeleteError);
      } else {
        swal("Delete Aborted");
      }
    });
  };
  onDeleteSuccess = id => {
    _logger("Id:" + id + "-Delete Successful");
    swal({
      title: "Item Removed From Cart",
      icon: "success"
    }).then(window.location.reload());
  };

  onDeleteError = id => {
    _logger("Id:" + id + "-Delete Failed");
  };

  updateMappedShoppingCart = id => {
    this.setState(prevState => {
      let newShoppingCart = [...prevState.shoppingCart];
      const index = newShoppingCart.findIndex(
        shoppingCart => shoppingCart.id === id
      );

      if (index >= 0) {
        newShoppingCart.splice(index, 1);
      }
      return {
        shoppingCart: newShoppingCart,
        mappedShoppingCarts: newShoppingCart.map(this.mapShoppingCart)
      };
    });
  };

  handleUpdateCardQuantity = (cart, evt) => {
    _logger(cart, evt.target.value, "=====Cart");
    let copyOfCarts = [...this.state.shoppingCarts];
    let index = copyOfCarts.findIndex(item => item.id === cart.id);
    if (index >= 0) {
      copyOfCarts[index].quantity = Number(evt.target.value);
    }
    this.setState(prevState => {
      return {
        ...prevState,
        shoppingCarts: copyOfCarts,
        mappedShoppingCarts: copyOfCarts.map(this.mapShoppingCart)
      };
    });
  };

  updateShoppingCart = shoppingCart => {
    shoppingCartService
      .update(shoppingCart)
      .then(this.onUpdateInventoryQuantitySuccess)
      .catch(this.onUpdateInventoryQuantityError);
  };

  onUpdateInventoryQuantitySuccess = response => {
    _logger(response);
    _logger("Success!");
    swal({
      title: "Great!",
      text: "Shopping cart was successfully updated",
      icon: "success",
      button: "Close"
    }).then(() => {
      this.getAll();
    });
  };

  onUpdateInventoryQuantityError = errResponse => {
    _logger(errResponse);
    swal("Failed to Update Cart");
  };

  getTotal = () => {
    let price = this.state.shoppingCarts.map(item => {
      let quantity = item.quantity;
      let basePrice = item.inventory.basePrice;
      return quantity * basePrice;
    });
    let total = price.reduce(this.getSum, 0);
    this.setState(prevState => {
      return {
        ...prevState,
        total: total,
        price: price
      };
    });
  };

  getSum = (total, num) => {
    return total + num;
  };

  applyCouponToCart = (shoppingCartItem, query) => {
    discountService
      .verify(shoppingCartItem.inventory.productId, query)
      .then(this.onCouponSuccess)
      .catch(this.onCouponError);
  };

  onCouponSuccess = response => {
    let couponOfCarts = [...this.state.shoppingCarts];
    let index = couponOfCarts.findIndex(
      item => item.inventory.productId === response.item.productId
    );
    if (index >= 0) {
      let inventory = { ...couponOfCarts[index].inventory };
      inventory.basePrice =
        inventory.basePrice -
        (response.item.percentage / 100) * inventory.basePrice;
      couponOfCarts[index].inventory = inventory;
    }
    this.setState(
      prevState => {
        return {
          ...prevState,
          shoppingCarts: couponOfCarts,
          mappedShoppingCarts: couponOfCarts.map(this.mapShoppingCart)
        };
      },
      () => this.getTotal()
    );
    swal("Promo Applied");
  };

  onCouponError = errResponse => {
    _logger(errResponse);
    swal("Invalid Promo Code");
  };

  handleCheckOut = () => {
    let checkout = {
      shoppingCarts: [...this.state.shoppingCarts],
      total: this.state.total
    };
    this.props.history.push("/checkout", checkout);
  };

  render() {
    return (
      <React.Fragment>
        <div
          className="container"
          style={{ color: "black", background: "white" }}
        >
          <div className="text-center" style={{ paddingTop: "3rem" }}>
            <h1>Shopping Cart</h1>
          </div>
          <div className="justify-content-md-center">
            <div className="col col-md-10" style={{ maxWidth: "100%" }}>
              {this.state.total > 0 ? (
                <div>
                  {this.state.mappedShoppingCarts}
                  <div
                    className="row justify-content-end"
                    style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                  >
                    <label
                      className="text-right col-md-2"
                      style={{ paddingRight: "2rem" }}
                    >
                      <strong>Subtotal:</strong>
                    </label>
                    <h3 className="subtotal" style={{ paddingRight: "2rem" }}>
                      <strong>${this.state.total}</strong>
                    </h3>
                  </div>
                  <div
                    className="row justify-content-end"
                    style={{
                      paddingBottom: "2rem",
                      paddingRight: "2rem"
                    }}
                  >
                    <button
                      style={{ color: "white" }}
                      type="button"
                      className="btn checkoutBtn"
                      onClick={this.handleCheckOut}
                    >
                      <strong>Checkout</strong>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="empty">
                    <h2>Your Shopping Cart is currently empty</h2>
                    <br />
                    <h3>
                      <a className="empty-text" href="/shop">
                        Browse here for a list of available products
                      </a>
                    </h3>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
ShoppingCart.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      shoppingCart: PropTypes.object.isRequired,
      inventoryId: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired
    })
  }),
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  checkoutCart: PropTypes.object
};

export default ShoppingCart;
