
// // src/pages/CheckoutPage/CheckoutPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
// import { useAuth } from '../../context/authProviderContext';
// import './checkoutPage.scss';
// import Menu from '../../components/globalComponents/headerMenu/menu';

// const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_live_51S5vXO2Lf1dW7ltx3Z3mGvdovsVl5i2GMBCL79fKhqBxAVRE42TA3D50gMHuN56TJGRqK0l5bFkKkCqCFciFbwJy00rOO2qfWq';
// const PAYPAL_CLIENT_ID = 'TU_CLIENT_ID_PAYPAL';
// const API_URL = process.env.REACT_APP_WC_API_URL || 'https://api.olawee.com/wp-json';

// const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// const api = {
//   async createOrder(orderData, token) {
//     const response = await fetch(`${API_URL}/wc/v3/orders`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(orderData)
//     });
    
//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || 'Error al crear orden');
//     }
    
//     return response.json();
//   },

//   async createPaymentIntent(orderId, amount, token) {
//     console.log('=== CREATE PAYMENT INTENT ===');
//     console.log('Order ID:', orderId);
//     console.log('Amount:', amount);
//     console.log('Amount in cents:', Math.round(amount * 100));
    
//     const requestBody = {
//       order_id: orderId,
//       amount: Math.round(amount * 100), // Plugin espera centavos
//       currency: 'eur'
//     };
    
//     console.log('Request:', requestBody);
    
//     const response = await fetch(`${API_URL}/olawee-stripe/v1/create-payment-intent`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(requestBody)
//     });
    
//     const data = await response.json();
//     console.log('Response:', data);
    
//     if (!response.ok) {
//       throw new Error(data.message || 'Error al crear Payment Intent');
//     }
    
//     return data;
//   },

//   async updateOrder(orderId, updateData, token) {
//     const response = await fetch(`${API_URL}/wc/v3/orders/${orderId}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify(updateData)
//     });
//     return response.json();
//   },

//   async confirmPayment(orderId, paymentIntentId, token) {
//     const response = await fetch(`${API_URL}/olawee-stripe/v1/confirm-payment`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         order_id: orderId,
//         payment_intent_id: paymentIntentId
//       })
//     });
//     return response.json();
//   }
// };

// // Formulario de pago Stripe
// function StripePaymentForm({ orderId, amount, onSuccess, onError, isSetupIntent = false }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handlePayment = async () => {
//     if (!stripe || !elements) {
//       onError('Stripe no está listo');
//       return;
//     }

//     setIsProcessing(true);
    
//     try {
//       // Si es Setup Intent (prueba gratuita)
//       if (isSetupIntent || amount === 0) {
//         console.log('Procesando Setup Intent (prueba gratuita)');
        
//         const { error, setupIntent } = await stripe.confirmSetup({
//           elements,
//           confirmParams: {
//             return_url: `${window.location.origin}/order-confirmation/${orderId}?trial=true`,
//           },
//           redirect: 'if_required'
//         });

//         if (error) {
//           console.error('Error en Setup Intent:', error);
//           onError(error.message);
//         } else if (setupIntent && setupIntent.status === 'succeeded') {
//           console.log('Setup Intent exitoso:', setupIntent.id);
//           onSuccess({ 
//             id: setupIntent.id, 
//             type: 'setup_intent',
//             status: 'succeeded'
//           });
//         }
//       } 
//       // Si es Payment Intent normal
//       else {
//         console.log('Procesando Payment Intent (pago normal)');
        
//         const { error, paymentIntent } = await stripe.confirmPayment({
//           elements,
//           confirmParams: {
//             return_url: `${window.location.origin}/order-confirmation/${orderId}`,
//           },
//           redirect: 'if_required'
//         });

//         if (error) {
//           console.error('Error en Payment Intent:', error);
//           onError(error.message);
//         } else if (paymentIntent && paymentIntent.status === 'succeeded') {
//           console.log('Payment Intent exitoso:', paymentIntent.id);
//           onSuccess(paymentIntent);
//         } else if (paymentIntent) {
//           // Otros estados: processing, requires_action, etc.
//           console.log('Payment Intent estado:', paymentIntent.status);
//           if (paymentIntent.status === 'processing') {
//             onSuccess(paymentIntent);
//           } else {
//             onError('El pago requiere acción adicional');
//           }
//         }
//       }
//     } catch (err) {
//       console.error('Error en el pago:', err);
//       onError(err.message || 'Error procesando el pago');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="payment-form">
//       <PaymentElement />
//       <button
//         onClick={handlePayment}
//         disabled={!stripe || isProcessing}
//         className="btn-pay"
//       >
//         {isProcessing 
//           ? 'Procesando...' 
//           : amount === 0 
//             ? 'Confirmar' 
//             : `Pagar ${amount.toFixed(2)}€`
//         }
//       </button>
//       {amount === 0 && (
//         <p className="trial-notice">
//           Periodo de prueba gratuito de 14 días. Se te cobrará 50€ después del periodo de prueba.
//         </p>
//       )}
//     </div>
//   );
// }

// const CheckoutPage = () => {
//   const navigate = useNavigate();
//   const { selectedProduct, user, isAuthenticated, clearSelectedProduct, getToken } = useAuth();

//   const [step, setStep] = useState('billing');
//   const [paymentMethod, setPaymentMethod] = useState('stripe');
//   const [orderId, setOrderId] = useState(null);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isFreeTrial, setIsFreeTrial] = useState(false);
//   const [futureCharge, setFutureCharge] = useState(null);

//   const [billingData, setBillingData] = useState({
//     first_name: user?.firstName || '',
//     last_name: user?.lastName || '',
//     email: user?.email || '',
//     phone: '',
//     address_1: '',
//     city: '',
//     postcode: '',
//     country: 'ES'
//   });

//   useEffect(() => {
//     if (!isAuthenticated) {
//       window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { type: 'login' } }));
//       navigate('/prices');
//       return;
//     }

//     if (!selectedProduct) {
//       const pendingProduct = sessionStorage.getItem('pending_product');
//       const savedProduct = sessionStorage.getItem('selected_product');
      
//       if (pendingProduct || savedProduct) {
//         sessionStorage.removeItem('pending_product');
//       } else {
//         navigate('/prices');
//       }
//     }
//   }, [isAuthenticated, selectedProduct, navigate]);

//   if (!selectedProduct) return null;

//   const total = parseFloat(selectedProduct.price) || 0;

//   const isFormValid = () => {
//     return billingData.first_name && 
//            billingData.last_name && 
//            billingData.email && 
//            billingData.email.includes('@') &&
//            billingData.address_1 && 
//            billingData.city && 
//            billingData.postcode;
//   };

//   const updateField = (field, value) => {
//     setBillingData(prev => ({...prev, [field]: value}));
//   };

//   const createOrder = async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const { token } = getToken();
//       if (!token) throw new Error('No se encontró token de autenticación');

//       console.log('=== CREANDO ORDEN ===');
//       console.log('Usuario:', user);
//       console.log('Total:', total);

//       const orderData = {
//         payment_method: paymentMethod === 'stripe' ? 'stripe' : 'ppcp-gateway',
//         payment_method_title: paymentMethod === 'stripe' ? 'Tarjeta / Klarna' : 'PayPal',
//         set_paid: false,
//         billing: billingData,
//         line_items: [{
//           product_id: selectedProduct.id,
//           quantity: 1
//         }],
//         customer_id: user?.id,
//         status: 'pending'
//       };

//       const order = await api.createOrder(orderData, token);
//       console.log('Orden creada:', order);

//       if (!order.id) {
//         throw new Error(order.message || 'Error al crear la orden');
//       }

//       setOrderId(order.id);

//       // Solo procesar Stripe aquí
//       if (paymentMethod === 'stripe') {
//         const paymentData = await api.createPaymentIntent(order.id, total, token);
//         console.log('Respuesta del plugin:', paymentData);

//         // CASO 1: Prueba gratuita
//         if (paymentData.free_trial) {
//           console.log('✓ Prueba gratuita detectada');
//           setIsFreeTrial(true);
          
//           if (paymentData.future_charge) {
//             setFutureCharge(paymentData.future_charge / 100);
//           }

//           // Si tiene client_secret, mostrar formulario de pago
//           if (paymentData.client_secret) {
//             setClientSecret(paymentData.client_secret);
//             setStep('payment');
//           } 
//           // Si no, completar directamente
//           else {
//             console.log('Prueba gratuita sin método de pago - completando');
//             clearSelectedProduct();
//             navigate(`/order-confirmation/${order.id}?trial=true`);
//           }
//         }
//         // CASO 2: Pago normal
//         else if (paymentData.client_secret) {
//           console.log('✓ Pago normal');
//           setIsFreeTrial(false);
//           setClientSecret(paymentData.client_secret);
//           setStep('payment');
//         }
//         else {
//           throw new Error('Respuesta inválida del servidor');
//         }
//       } 
//       // PayPal
//       else {
//         setStep('payment');
//       }

//     } catch (err) {
//       console.error('Error:', err);
//       setError(err.message || 'Error al procesar la orden');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePaymentSuccess = async (paymentDetails) => {
//     try {
//       const { token } = getToken();
      
//       console.log('Pago exitoso:', paymentDetails);
      
//       // Confirmar el pago en el backend
//       if (paymentDetails.type !== 'setup_intent') {
//         await api.confirmPayment(orderId, paymentDetails.id, token);
//       }

//       // Actualizar orden
//       await api.updateOrder(orderId, {
//         status: 'processing',
//         transaction_id: paymentDetails.id
//       }, token);

//       clearSelectedProduct();
      
//       // Redirigir
//       if (isFreeTrial || total === 0) {
//         navigate(`/order-confirmation/${orderId}?trial=true`);
//       } else {
//         navigate(`/order-confirmation/${orderId}`);
//       }
//     } catch (err) {
//       console.error('Error actualizando orden:', err);
//       // Aunque haya error, el pago se procesó, así que redirigimos
//       clearSelectedProduct();
//       navigate(`/order-confirmation/${orderId}`);
//     }
//   };

//   const handlePaymentError = (errorMessage) => {
//     setError(errorMessage);
//   };

//   return (
//     <div className="checkout-page">
//         <Menu />
//       <div className="checkout-container">
//         <h1 className="checkout-title">Finalizar compra</h1>

//         <div className="checkout-grid">
//           <div className="checkout-main">
//             {step === 'billing' && (
//               <div className="checkout-section">
//                 <h2>Datos de facturación</h2>
                
//                 <div className="form-grid">
//                   <div className="form-field">
//                     <label>Nombre *</label>
//                     <input
//                       type="text"
//                       value={billingData.first_name}
//                       onChange={(e) => updateField('first_name', e.target.value)}
//                       placeholder="Tu nombre"
//                     />
//                   </div>
                  
//                   <div className="form-field">
//                     <label>Apellidos *</label>
//                     <input
//                       type="text"
//                       value={billingData.last_name}
//                       onChange={(e) => updateField('last_name', e.target.value)}
//                       placeholder="Tus apellidos"
//                     />
//                   </div>
                  
//                   <div className="form-field full-width">
//                     <label>Email *</label>
//                     <input
//                       type="email"
//                       value={billingData.email}
//                       onChange={(e) => updateField('email', e.target.value)}
//                       placeholder="tu@email.com"
//                     />
//                   </div>
                  
//                   <div className="form-field full-width">
//                     <label>Teléfono</label>
//                     <input
//                       type="tel"
//                       value={billingData.phone}
//                       onChange={(e) => updateField('phone', e.target.value)}
//                       placeholder="+34 600 000 000"
//                     />
//                   </div>
                  
//                   <div className="form-field full-width">
//                     <label>Dirección *</label>
//                     <input
//                       type="text"
//                       value={billingData.address_1}
//                       onChange={(e) => updateField('address_1', e.target.value)}
//                       placeholder="Calle, número, piso..."
//                     />
//                   </div>
                  
//                   <div className="form-field">
//                     <label>Ciudad *</label>
//                     <input
//                       type="text"
//                       value={billingData.city}
//                       onChange={(e) => updateField('city', e.target.value)}
//                       placeholder="Tu ciudad"
//                     />
//                   </div>
                  
//                   <div className="form-field">
//                     <label>Código postal *</label>
//                     <input
//                       type="text"
//                       value={billingData.postcode}
//                       onChange={(e) => updateField('postcode', e.target.value)}
//                       placeholder="28000"
//                     />
//                   </div>
//                 </div>

//                 <div className="payment-method-section">
//                   <h3>Método de pago</h3>
//                   <div className="payment-methods">
//                     <label className="payment-option">
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="stripe"
//                         checked={paymentMethod === 'stripe'}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                       <span>Tarjeta de crédito / Klarna</span>
//                     </label>
                    
//                     <label className="payment-option">
//                       <input
//                         type="radio"
//                         name="payment"
//                         value="paypal"
//                         checked={paymentMethod === 'paypal'}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                       />
//                       <span>PayPal</span>
//                     </label>
//                   </div>
//                 </div>

//                 {error && <div className="error-message">{error}</div>}

//                 <button
//                   onClick={createOrder}
//                   disabled={!isFormValid() || isLoading}
//                   className="btn-continue"
//                 >
//                   {isLoading ? 'Creando orden...' : 'Continuar al pago'}
//                 </button>
//               </div>
//             )}

//             {step === 'payment' && paymentMethod === 'stripe' && clientSecret && (
//               <div className="checkout-section">
//                 <h2>{total === 0 ? 'Guardar método de pago' : 'Completar pago'}</h2>
                
//                 {/* {total === 0 && (
//                   <div className="trial-info">
//                     <h3>Periodo de prueba gratuito de 14 días</h3>
//                     <p>No se te cobrará nada ahora.</p>
//                     {futureCharge && (
//                       <p><strong>Después de 14 días:</strong> Se cobrará automáticamente {futureCharge.toFixed(2)}€</p>
//                     )}
//                   </div>
//                 )} */}
                
//                 {error && <div className="error-message">{error}</div>}
                
//                 <Elements stripe={stripePromise} options={{ clientSecret }}>
//                   <StripePaymentForm
//                     orderId={orderId}
//                     amount={total}
//                     onSuccess={handlePaymentSuccess}
//                     onError={handlePaymentError}
//                     isSetupIntent={total === 0}
//                   />
//                 </Elements>
//               </div>
//             )}

//             {step === 'payment' && paymentMethod === 'paypal' && (
//               <div className="checkout-section">
//                 <h2>Pagar con PayPal</h2>
//                 {error && <div className="error-message">{error}</div>}
//                 <PayPalScriptProvider options={{ 
//                   'client-id': PAYPAL_CLIENT_ID, 
//                   currency: 'EUR' 
//                 }}>
//                   <PayPalButtons
//                     createOrder={(data, actions) => {
//                       return actions.order.create({
//                         purchase_units: [{
//                           reference_id: orderId.toString(),
//                           amount: {
//                             value: total.toFixed(2),
//                             currency_code: 'EUR'
//                           }
//                         }]
//                       });
//                     }}
//                     onApprove={async (data, actions) => {
//                       const details = await actions.order.capture();
//                       handlePaymentSuccess(details);
//                     }}
//                     onError={() => handlePaymentError('Error con PayPal')}
//                   />
//                 </PayPalScriptProvider>
//               </div>
//             )}
//           </div>

//           <div className="checkout-sidebar">
//             <div className="order-summary">
//               <h3>Resumen del pedido</h3>
              
//               <div className="product-summary">
//                 <div className="product-name">{selectedProduct.name}</div>
//                 <div className="product-price">
//                   {total === 0 ? (
//                     <>
//                       <span className="trial-badge">Prueba gratuita</span>
//                       {futureCharge && (
//                         <span className="future-price">{futureCharge.toFixed(2)}€ después de 14 días</span>
//                       )}
//                     </>
//                   ) : (
//                     `${selectedProduct.price}€`
//                   )}
//                 </div>
//               </div>

//               <div className="summary-row">
//                 <span>Subtotal:</span>
//                 <span>{total.toFixed(2)}€</span>
//               </div>
              
//               {total > 0 && (
//                 <div className="summary-row">
//                   <span>IVA (21%):</span>
//                   <span>{(total * 0.21).toFixed(2)}€</span>
//                 </div>
//               )}
              
//               <div className="summary-total">
//                 <span>Total {total === 0 ? 'hoy' : ''}:</span>
//                 <span>{total === 0 ? '0€' : `${(total * 1.21).toFixed(2)}€`}</span>
//               </div>

//               <div className="summary-benefits">
//                 <div>{total === 0 ? '14 días de prueba gratuita' : 'Entrega inmediata'}</div>
//                 <div>Pago 100% seguro</div>
//                 <div>Soporte incluido</div>
//                 {total === 0 && <div>Cancela cuando quieras</div>}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

















// src/pages/CheckoutPage/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../../context/authProviderContext';
import './checkoutPage.scss';
import Menu from '../../components/globalComponents/headerMenu/menu';

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_live_51S5vXO2Lf1dW7ltx3Z3mGvdovsVl5i2GMBCL79fKhqBxAVRE42TA3D50gMHuN56TJGRqK0l5bFkKkCqCFciFbwJy00rOO2qfWq';
const PAYPAL_CLIENT_ID = 'TU_CLIENT_ID_PAYPAL';
const API_URL = process.env.REACT_APP_WC_API_URL || 'https://api.olawee.com/wp-json';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

const api = {
  async createOrder(orderData, token) {
    const response = await fetch(`${API_URL}/wc/v3/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear orden');
    }
    
    return response.json();
  },

  async createPaymentIntent(orderId, amount, token) {
    console.log('=== CREATE PAYMENT INTENT ===');
    console.log('Order ID:', orderId);
    console.log('Amount:', amount);
    console.log('Amount in cents:', Math.round(amount * 100));
    
    const requestBody = {
      order_id: orderId,
      amount: Math.round(amount * 100), // Plugin espera centavos
      currency: 'eur'
    };
    
    console.log('Request:', requestBody);
    
    const response = await fetch(`${API_URL}/olawee-stripe/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear Payment Intent');
    }
    
    return data;
  },

  async updateOrder(orderId, updateData, token) {
    const response = await fetch(`${API_URL}/wc/v3/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    return response.json();
  },

  async confirmPayment(orderId, paymentIntentId, token) {
    const response = await fetch(`${API_URL}/olawee-stripe/v1/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_intent_id: paymentIntentId
      })
    });
    return response.json();
  }
};

// Formulario de pago Stripe
function StripePaymentForm({ orderId, amount, onSuccess, onError, isSetupIntent = false }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      onError('Stripe no está listo');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Si es Setup Intent (prueba gratuita)
      if (isSetupIntent || amount === 0) {
        console.log('Procesando Setup Intent (prueba gratuita)');
        
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation/${orderId}?trial=true`,
          },
          redirect: 'if_required'
        });

        if (error) {
          console.error('Error en Setup Intent:', error);
          onError(error.message);
        } else if (setupIntent && setupIntent.status === 'succeeded') {
          console.log('Setup Intent exitoso:', setupIntent.id);
          onSuccess({ 
            id: setupIntent.id, 
            type: 'setup_intent',
            status: 'succeeded'
          });
        }
      } 
      // Si es Payment Intent normal
      else {
        console.log('Procesando Payment Intent (pago normal)');
        
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation/${orderId}`,
          },
          redirect: 'if_required'
        });

        if (error) {
          console.error('Error en Payment Intent:', error);
          onError(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          console.log('Payment Intent exitoso:', paymentIntent.id);
          onSuccess(paymentIntent);
        } else if (paymentIntent) {
          // Otros estados: processing, requires_action, etc.
          console.log('Payment Intent estado:', paymentIntent.status);
          if (paymentIntent.status === 'processing') {
            onSuccess(paymentIntent);
          } else {
            onError('El pago requiere acción adicional');
          }
        }
      }
    } catch (err) {
      console.error('Error en el pago:', err);
      onError(err.message || 'Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <PaymentElement />
      <button
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        className="btn-pay"
      >
        {isProcessing 
          ? 'Procesando...' 
          : amount === 0 
            ? 'Guardar método de pago' 
            : `Pagar ${amount.toFixed(2)}€`
        }
      </button>
      {amount === 0 && (
        <p className="trial-notice">
          ✨ Periodo de prueba gratuito de 14 días. Se te cobrará 50€ después del periodo de prueba.
        </p>
      )}
    </div>
  );
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { selectedProduct, user, isAuthenticated, clearSelectedProduct, getToken } = useAuth();

  const [step, setStep] = useState('billing');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [orderId, setOrderId] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [futureCharge, setFutureCharge] = useState(null);

  const [billingData, setBillingData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_1: '',
    city: '',
    postcode: '',
    country: 'ES'
  });

  // 🔥 NUEVO: Actualizar datos del formulario cuando el usuario cargue
  useEffect(() => {
    if (user) {
      console.log('👤 Usuario cargado, actualizando formulario:', user.email);
      setBillingData(prev => ({
        ...prev,
        first_name: user.firstName || prev.first_name,
        last_name: user.lastName || prev.last_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        // Mantener address, city, postcode si ya tienen datos
        address_1: prev.address_1 || '',
        city: prev.city || '',
        postcode: prev.postcode || '',
      }));
    }
  }, [user]); // 🔥 Se ejecuta cuando user cambia

  useEffect(() => {
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { type: 'login' } }));
      navigate('/prices');
      return;
    }

    if (!selectedProduct) {
      const pendingProduct = sessionStorage.getItem('pending_product');
      const savedProduct = sessionStorage.getItem('selected_product');
      
      if (pendingProduct || savedProduct) {
        sessionStorage.removeItem('pending_product');
      } else {
        navigate('/prices');
      }
    }
  }, [isAuthenticated, selectedProduct, navigate]);

  if (!selectedProduct) return null;

  const total = parseFloat(selectedProduct.price) || 0;

  const isFormValid = () => {
    return billingData.first_name && 
           billingData.last_name && 
           billingData.email && 
           billingData.email.includes('@') &&
           billingData.address_1 && 
           billingData.city && 
           billingData.postcode;
  };

  const updateField = (field, value) => {
    setBillingData(prev => ({...prev, [field]: value}));
  };

  const createOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { token } = getToken();
      if (!token) throw new Error('No se encontró token de autenticación');

      console.log('=== CREANDO ORDEN ===');
      console.log('Usuario:', user);
      console.log('Total:', total);

      const orderData = {
        payment_method: paymentMethod === 'stripe' ? 'stripe' : 'ppcp-gateway',
        payment_method_title: paymentMethod === 'stripe' ? 'Tarjeta / Klarna' : 'PayPal',
        set_paid: false,
        billing: billingData,
        line_items: [{
          product_id: selectedProduct.id,
          quantity: 1
        }],
        customer_id: user?.id,
        status: 'pending'
      };

      const order = await api.createOrder(orderData, token);
      console.log('Orden creada:', order);

      if (!order.id) {
        throw new Error(order.message || 'Error al crear la orden');
      }

      setOrderId(order.id);

      // Solo procesar Stripe aquí
      if (paymentMethod === 'stripe') {
        const paymentData = await api.createPaymentIntent(order.id, total, token);
        console.log('Respuesta del plugin:', paymentData);

        // CASO 1: Prueba gratuita
        if (paymentData.free_trial) {
          console.log('✓ Prueba gratuita detectada');
          setIsFreeTrial(true);
          
          if (paymentData.future_charge) {
            setFutureCharge(paymentData.future_charge / 100);
          }

          // Si tiene client_secret, mostrar formulario de pago
          if (paymentData.client_secret) {
            setClientSecret(paymentData.client_secret);
            setStep('payment');
          } 
          // Si no, completar directamente
          else {
            console.log('Prueba gratuita sin método de pago - completando');
            clearSelectedProduct();
            navigate(`/order-confirmation/${order.id}?trial=true`);
          }
        }
        // CASO 2: Pago normal
        else if (paymentData.client_secret) {
          console.log('✓ Pago normal');
          setIsFreeTrial(false);
          setClientSecret(paymentData.client_secret);
          setStep('payment');
        }
        else {
          throw new Error('Respuesta inválida del servidor');
        }
      } 
      // PayPal
      else {
        setStep('payment');
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error al procesar la orden');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const { token } = getToken();
      
      console.log('Pago exitoso:', paymentDetails);
      
      // Confirmar el pago en el backend
      if (paymentDetails.type !== 'setup_intent') {
        await api.confirmPayment(orderId, paymentDetails.id, token);
      }

      // Actualizar orden
      await api.updateOrder(orderId, {
        status: 'processing',
        transaction_id: paymentDetails.id
      }, token);

      clearSelectedProduct();
      
      // Redirigir
      if (isFreeTrial || total === 0) {
        navigate(`/order-confirmation/${orderId}?trial=true`);
      } else {
        navigate(`/order-confirmation/${orderId}`);
      }
    } catch (err) {
      console.error('Error actualizando orden:', err);
      // Aunque haya error, el pago se procesó, así que redirigimos
      clearSelectedProduct();
      navigate(`/order-confirmation/${orderId}`);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="checkout-page">
        <Menu />
      <div className="checkout-container">
        <h1 className="checkout-title">Finalizar compra</h1>

        <div className="checkout-grid">
          <div className="checkout-main">
            {step === 'billing' && (
              <div className="checkout-section">
                <h2>Datos de facturación</h2>
                
                <div className="form-grid">
                  <div className="form-field">
                    <label>Nombre *</label>
                    <input
                      type="text"
                      value={billingData.first_name}
                      onChange={(e) => updateField('first_name', e.target.value)}
                      placeholder="Tu nombre"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Apellidos *</label>
                    <input
                      type="text"
                      value={billingData.last_name}
                      onChange={(e) => updateField('last_name', e.target.value)}
                      placeholder="Tus apellidos"
                    />
                  </div>
                  
                  <div className="form-field full-width">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={billingData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div className="form-field full-width">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={billingData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+34 600 000 000"
                    />
                  </div>
                  
                  <div className="form-field full-width">
                    <label>Dirección *</label>
                    <input
                      type="text"
                      value={billingData.address_1}
                      onChange={(e) => updateField('address_1', e.target.value)}
                      placeholder="Calle, número, piso..."
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Ciudad *</label>
                    <input
                      type="text"
                      value={billingData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Tu ciudad"
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Código postal *</label>
                    <input
                      type="text"
                      value={billingData.postcode}
                      onChange={(e) => updateField('postcode', e.target.value)}
                      placeholder="28000"
                    />
                  </div>
                </div>

                <div className="payment-method-section">
                  <h3>Método de pago</h3>
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>Tarjeta de crédito / Klarna</span>
                    </label>
                    
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span>PayPal</span>
                    </label>
                  </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <button
                  onClick={createOrder}
                  disabled={!isFormValid() || isLoading}
                  className="btn-continue"
                >
                  {isLoading ? 'Creando orden...' : 'Continuar al pago'}
                </button>
              </div>
            )}

            {step === 'payment' && paymentMethod === 'stripe' && clientSecret && (
              <div className="checkout-section">
                <h2>{total === 0 ? 'Guardar método de pago' : 'Completar pago'}</h2>
                
                {total === 0 && (
                  <div className="trial-info">
                    <h3>🎉 Periodo de prueba gratuito de 14 días</h3>
                    <p>No se te cobrará ahora. Guarda tu método de pago para después del periodo de prueba.</p>
                    {futureCharge && (
                      <p><strong>Después de 14 días:</strong> Se cobrará automáticamente {futureCharge.toFixed(2)}€</p>
                    )}
                  </div>
                )}
                
                {error && <div className="error-message">{error}</div>}
                
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <StripePaymentForm
                    orderId={orderId}
                    amount={total}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    isSetupIntent={total === 0}
                  />
                </Elements>
              </div>
            )}

            {step === 'payment' && paymentMethod === 'paypal' && (
              <div className="checkout-section">
                <h2>Pagar con PayPal</h2>
                {error && <div className="error-message">{error}</div>}
                <PayPalScriptProvider options={{ 
                  'client-id': PAYPAL_CLIENT_ID, 
                  currency: 'EUR' 
                }}>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          reference_id: orderId.toString(),
                          amount: {
                            value: total.toFixed(2),
                            currency_code: 'EUR'
                          }
                        }]
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      handlePaymentSuccess(details);
                    }}
                    onError={() => handlePaymentError('Error con PayPal')}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Resumen del pedido</h3>
              
              <div className="product-summary">
                <div className="product-name">{selectedProduct.name}</div>
                <div className="product-price">
                  {total === 0 ? (
                    <>
                      <span className="trial-badge">Prueba gratuita</span>
                      {futureCharge && (
                        <span className="future-price">{futureCharge.toFixed(2)}€ después de 14 días</span>
                      )}
                    </>
                  ) : (
                    `${selectedProduct.price}€`
                  )}
                </div>
              </div>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{total.toFixed(2)}€</span>
              </div>
              
              {total > 0 && (
                <div className="summary-row">
                  <span>IVA (21%):</span>
                  <span>{(total * 0.21).toFixed(2)}€</span>
                </div>
              )}
              
              <div className="summary-total">
                <span>Total {total === 0 ? 'hoy' : ''}:</span>
                <span>{total === 0 ? '0€' : `${(total * 1.21).toFixed(2)}€`}</span>
              </div>

              <div className="summary-benefits">
                <div>{total === 0 ? '14 días de prueba gratuita' : 'Entrega inmediata'}</div>
                <div>Pago 100% seguro</div>
                <div>Soporte incluido</div>
                {total === 0 && <div>Cancela cuando quieras</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;