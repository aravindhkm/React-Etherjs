import { useState, useEffect } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";

function redirect() {
}

const presaleAddr = "0x3d079b51EA706c9a7A40bc62e9CBF836060984Cd";
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountout","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"time","type":"uint256"}],"name":"_buyEvent","type":"event"},{"inputs":[],"name":"bnbBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"buy","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getSaleTokenBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maximumAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"priceFeed","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"saleEndTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"salePrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"saleToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minimumAmount","type":"uint256"},{"internalType":"uint256","name":"_maximumAmount","type":"uint256"}],"name":"setMinAndMaxAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_saleStartTime","type":"uint256"},{"internalType":"uint256","name":"_saleEndTime","type":"uint256"}],"name":"setPreSaleTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_salePrice","type":"uint256"}],"name":"setSalePrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"totalSaleTokenOut","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawLeftOverMatic","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"token","type":"address"}],"name":"withdrawLeftOverToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdrawSaleToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}];


const startPayment = async ({ setError, setTxs, input, addr }) => {
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");

    console.log("Hello")
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const presaleInstance = new ethers.Contract( presaleAddr,abi,signer)
    const userAddress = await signer.getAddress()

    console.log("signer", userAddress, ethers.utils.getAddress(addr))
    ethers.utils.getAddress(addr);

    // Function call with param
    const tx = await presaleInstance.connect(signer).withdrawSaleToken(userAddress,ethers.utils.parseEther(input))

    // const tx = await txHash.wait();

    // payable function
    // const tx = await presaleInstance.connect(signer).buy({value:ethers.utils.parseEther(input) })

    // transfer user account
    // const tx = await signer.sendTransaction({
    //   to: addr,
    //   value: ethers.utils.parseEther(input)
    // });

    console.log({ input, addr });
    console.log("tx", tx);
    setTxs([tx]);
  } catch (err) {
    setError(err.message);
  }
};



export default function App() {
  const [error, setError] = useState();
  const [input, setInput] = useState(0);
  const [AmountOut, setAmountOut] = useState(0);
  const [txs, setTxs] = useState([]);

  const handleSubmit = async () => {
    setError();
    await startPayment({
      setError,
      setTxs,
      input,
      addr: "0x3d079b51EA706c9a7A40bc62e9CBF836060984Cd"
    });
    // redirect();
  };

  useEffect(() => {
      if (input != 0) {
        setAmountOut(input * 4);
      }
    },
    [input] // could have also passed another argument here with timer instead of passing as function
  );

  return (
      <div className="credit-card w-full lg:w-1/2 sm:w-auto mx-auto">
        <main className="p-4">
          <div className="col-xs-3">
            <input
              name="ether"
              type="text"
              className="input input-bordered block w-full focus:ring focus:outline-none"
              placeholder="Amount in MATIC"
              onChange={e => setInput(e.target.value)}
            />
          </div>          
        </main>
        <footer className="px-5">
          <div className="my-0">
            <button
              type="submit"
              className="my-2 btn btn-primary submit-button focus:ring focus:outline-none w-full"
              onClick={() => handleSubmit()}
            >
              Send MATIC, Get {AmountOut} ANMLZ
            </button>
            <div className="my-2">
              <ErrorMessage message={error} />
              <TxList txs={txs} />
            </div>
          </div>
        </footer>
      </div>
  );
}
