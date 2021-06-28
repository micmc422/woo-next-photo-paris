import Error from "./Error";

const PaymentModes = ( { input, handleOnChange } ) => {

	const { errors, paymentMethod } = input || {}

	return (
		<div className="mt-3">
			<Error errors={ errors } fieldName={ 'paymentMethod' }/>
			{/*Direct bank transfers*/}
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="bacs" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'bacs' === paymentMethod}/>
					<span className="woo-next-payment-content">Direct Bank Transfer</span>
				</label>
			</div>
			{/*Pay with Paypal*/}
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="paypal" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'paypal' === paymentMethod}/>
					<span className="woo-next-payment-content">Pay with Paypal</span>
				</label>
			</div>
			{/*Check Payments*/}
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="cheque" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'cheque' === paymentMethod}/>
					<span className="woo-next-payment-content">Check Payments</span>
				</label>
			</div>
			{/*Pay with Stripe*/}
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="cod" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'cod' === paymentMethod}/>
					<span className="woo-next-payment-content">Cash on Delivery</span>
				</label>
			</div>
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="jccpaymentgatewayredirect" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'jccpaymentgatewayredirect' === paymentMethod}/>
					<span className="woo-next-payment-content">JCC</span>
				</label>
			</div>
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="ccavenue" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'ccavenue' === paymentMethod}/>
					<span className="woo-next-payment-content">CC Avenue</span>
				</label>
			</div>
			<div className="mt-2 form-check woo-next-payment-input-container">
				<label className="form-check-label">
					<input onChange={ handleOnChange } value="stripe" className="mr-3 form-check-input" name="paymentMethod" type="radio" checked={'stripe' === paymentMethod}/>
					<span className="woo-next-payment-content">Stripe</span>
				</label>
			</div>
			{/*	Payment Instructions*/}
			<div className="mt-2 woo-next-checkout-payment-instructions">
				Please send a check to Store Name, Store Street, Store Town, Store State / County, Store Postcode.
			</div>
		</div>
	);
};

export default PaymentModes;
