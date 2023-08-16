/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51NdkruA05HovxtMA99bCjALwfOo9e3TfIWDmOjf64MwsXbJkjYy2ts0V4JhBGFxbhaE0fOXvHe0lytGWFpZHld0u00itgXmCny');

export const bookTour = async tourId => {
    try {
        // 1) Get checkout session from API
        const session = await axios(`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`);
        console.log(session);

        // 2) Create checkout form + chanre credit card 
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        console.log(err);
        showAlert('error', err)
    }
    
};
