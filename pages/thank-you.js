import {useState, useEffect, useContext} from "react";
import Router from "next/router";
import Link from 'next/link';
import axios from "axios";
import Layout from "../src/components/Layout";
import {AppContext} from "../src/components/context/AppContext";
import Loading from "../src/components/icons/Loading";
import ShoppingCart from "../src/components/icons/ShoppingCart";

const ThankYouContent = () => {
    const [cart, setCart] = useContext(AppContext);
    const [isSessionFetching, setSessionFetching] = useState(false);
    const [sessionData, setSessionData] = useState({});
    const session_id = process.browser ? Router.query.session_id : null;

    useEffect(() => {
        setSessionFetching(true);
        if (process.browser) {
            localStorage.removeItem('woo-next-cart');
            setCart(null);

            if (session_id) {
                axios.get(`/api/get-stripe-session/?session_id=${session_id}`)
                    .then((response) => {
                        setSessionData(response?.data ?? {});
                        setSessionFetching(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        setSessionFetching(false);
                    });
            }
        }

    }, [session_id]);

    return (
        <div className="h-almost-screen">
            <div className="m-auto mt-10 w-600px">
                {isSessionFetching ? <Loading/> : (
                    <>
                        <h2 className="mb-6 text-xl"><ShoppingCart className="inline-block mr-1"/> <span>Thank you for placing the order.</span></h2>
                        <p>Your payment is successful and your order details are: </p>
                        <table className="w-full mb-8 text-left whitespace-no-wrap table-auto">
                            <thead>
                            <tr>
                                <th className="px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 rounded-tl rounded-bl title-font">Name</th>
                                <th className="px-4 py-3 text-sm font-medium tracking-wider text-gray-900 bg-gray-100 title-font">Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="px-4 py-3">Order#</td>
                                <td className="px-4 py-3">{sessionData?.metadata?.orderId}</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Email</td>
                                <td className="px-4 py-3">{sessionData?.customer_email}</td>
                            </tr>
                            </tbody>
                        </table>
                        <Link href="/">
                            <a className="w-auto px-5 py-3 text-white bg-purple-600 rounded-sm">Shop more</a>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

const ThankYou = () => {
    return (
        <Layout>
            <ThankYouContent/>
        </Layout>
    )
}

export default ThankYou;