import PropTypes from "prop-types";
import QuantitySelector from "./QuantitySelector";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-300 py-4">
      <div className="flex items-center">
        <img
          src={item.imageUrls ? item.imageUrls[0] : ""}
          alt={`Imagen de ${item.name}`}
          className="w-24 h-24 object-cover rounded-md mr-4"
        />
        <div>
          <p className="text-xl font-semibold text-black">{item.name}</p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-blue-500 hover:underline"
          >
            Eliminar
          </button>
        </div>
      </div>
      <div className="text-lg text-gray-600">
        <QuantitySelector
          productId={item.id}
          initialQuantity={item.quantity}
          onQuantityChange={(newQuantity) => onQuantityChange(item.id, newQuantity)}
        />
      </div>
      <div className="text-lg text-black font-semibold">${item.price}</div>
    </div>
  );
};

CartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
