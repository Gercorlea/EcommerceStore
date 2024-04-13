"use client";
import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { MinusCircle, PlusCircle, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Cart = () => {
  const router = useRouter();
  const user = useUser();
  const cart = useCart();
  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );
  
  const totalRounded = parseFloat(total.toFixed(2));
  const customer = {
    clerkId: user?.user?.id,
    email: user?.user?.emailAddresses[0].emailAddress,
    name: user?.user?.fullName,
  };

  const handleCheckout = async () => {
    try {
      if (!user.isSignedIn) {
        router.push("/sign-in");
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
          method: "POST",
          body: JSON.stringify({
            cartItems: cart.cartItems,
            customer,
          }),
        });
        const data = await res.json();
        window.location.href = data.url;
        console.log(data);
      }
    } catch (error) {
      console.log("[checkout_POST]", error);
    }
  };

  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />
        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No items in cart</p>
        ) : (
          <div>
            {cart.cartItems.map((cartItem) => (
              <div
                key={cartItem.item._id}
                className="w-full flex hover:bg-grey-1 px-6 py-5 items-center justify-between  max-md:flex-col max-md:items-start"
              >
                <div className="flex items-center">
                  <Image
                    width={100}
                    height={100}
                    src={cartItem.item.media[0]}
                    alt="product"
                    className="rounded-lg w-32 h-32 object-cover"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <p className="text-body-bold">{cartItem.item.title}</p>
                    {cartItem.color && (
                      <p className="text-small-medium">{cartItem.color}</p>
                    )}
                    {cartItem.size && (
                      <p className="text-small-medium">{cartItem.size}</p>
                    )}
                    <p className="text-small-medium">
                      ${cartItem.item.price} * {cartItem.quantity} = $
                      {cartItem.item.price * cartItem.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center max-md:my-6 ">
                  <MinusCircle
                    className={`hover:text-red-1 cursor-pointer ${
                      cartItem.quantity <= 1 &&
                      "disabled text-grey-2 hover:text-grey-2 cursor-default"
                    }`}
                    onClick={() =>
                      cartItem.quantity > 1 &&
                      cart.decreaseQuantity(cartItem.item._id)
                    }
                  />
                  <p className="text-body-bold">{cartItem.quantity}</p>
                  <PlusCircle
                    className="hover:text-red-1 cursor-pointer"
                    onClick={() => cart.increaseQuantity(cartItem.item._id)}
                  />
                  <Trash
                    className="hover:text-red-1 cursor-pointer md:ml-10"
                    onClick={() => cart.removeItem(cartItem.item._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-1/3 flex-col flex gap-8 bg-grey-1 rounded-lg px-4 py-5 max-lg:w-full">
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${
            cart.cartItems.length > 1 ? "items" : "item"
          })`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>${totalRounded}</span>
        </div>
        <button
          className="border rounded-lg text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

export const dynamic = 'force-dynamic'