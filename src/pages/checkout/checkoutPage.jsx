
// src/pages/CheckoutPage/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useAuth } from '../../context/authProviderContext';
import './checkoutPage.scss';
import Menu from '../../components/globalComponents/headerMenu/menu';

const STRIPE_PUBLIC_KEY =
  process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
  'pk_live_51S5vXO2Lf1dW7ltx3Z3mGvdovsVl5i2GMBCL79fKhqBxAVRE42TA3D50gMHuN56TJGRqK0l5bFkKkCqCFciFbwJy00rOO2qfWq';
const PAYPAL_CLIENT_ID = 'TU_CLIENT_ID_PAYPAL';
const API_URL = process.env.REACT_APP_WC_API_URL || 'https://api.olawee.com/wp-json';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

// ⚙️ Configura aquí qué productos son "trial" (gratis 14 días)
const TRIAL_PRODUCT_IDS = [78]; // <-- pon aquí los IDs Woo del/los producto(s) con prueba
const FUTURE_CHARGE_EUR = 50;   // cargo después de la prueba (en euros)

const api = {
  async createOrder(orderData, token) {
    const response = await fetch(`${API_URL}/olawee/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear orden');
    }
    return response.json();
  },

  async createPaymentIntent(orderId, amount, token) {
    // amount llega en euros -> lo pasamos a céntimos
    const requestBody = {
      order_id: orderId,
      amount: Math.round(Number(amount || 0) * 100),
      currency: 'eur',
    };

    const response = await fetch(`${API_URL}/olawee-stripe/v1/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear Payment Intent');
    }
    return data;
  },

  async updateOrder(orderId, updateData, token) {
    const response = await fetch(`${API_URL}/olawee/v1/orders/${orderId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'No se pudo actualizar el pedido');
    }
    return data;
  },

  async confirmPayment(orderId, paymentIntentId, token, setupIntentId = null) {
    const body = {
      order_id: orderId,
    };

    // Enviar el parámetro correcto según el tipo
    if (setupIntentId) {
      body.setup_intent_id = setupIntentId;
    }
    if (paymentIntentId) {
      body.payment_intent_id = paymentIntentId;
    }

    const response = await fetch(`${API_URL}/olawee-stripe/v1/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data?.message || 'Error al confirmar el pago');
    }
    
    return data;
  },

  async verifyIntent(orderId, paymentIntentId, token) {
    const response = await fetch(`${API_URL}/olawee-stripe/v1/verify-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        payment_intent_id: paymentIntentId
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || 'No se pudo verificar el pago con Stripe');
    }
    return data;
  },

  
};



// ──────────────────────────────────────────────────────────────
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
      if (isSetupIntent || amount === 0) {
        // Setup Intent → guardar método (0€ ahora)
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation/${orderId}?trial=true`,
          },
          redirect: 'if_required',
        });

        if (error) {
          onError(error.message);
        } else if (setupIntent && setupIntent.status === 'succeeded') {
          onSuccess({
            id: setupIntent.id,
            type: 'setup_intent',
            status: 'succeeded',
          });
        } else {
          onError('No se pudo completar el guardado del método de pago');
        }
      } else {
        // Payment Intent → cobro normal
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/order-confirmation/${orderId}`,
          },
          redirect: 'if_required',
        });

        if (error) {
          onError(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
          onSuccess(paymentIntent);
        } else if (paymentIntent && paymentIntent.status === 'processing') {
          onSuccess(paymentIntent);
        } else {
          onError('El pago requiere acción adicional');
        }
      }
    } catch (err) {
      onError(err.message || 'Error procesando el pago');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <PaymentElement />
      <button onClick={handlePayment} disabled={!stripe || isProcessing} className="btn-pay">
        {isProcessing ? 'Procesando...' : amount === 0 ? 'Confirmar' : `Pagar ${Number(amount).toFixed(2)}€`}
      </button>
      {amount === 0 && (
        <p className="trial-notice">
          Periodo de prueba gratuito de 14 días. Se te cobrará {FUTURE_CHARGE_EUR}€ después del periodo de prueba.
        </p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Página de Checkout
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

  //es-lint-disable-next-line no-unused-vars
  const [futureCharge, setFutureCharge] = useState(null);

  const [billingData, setBillingData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_1: '',
    city: '',
    postcode: '',
    country: 'ES',
  });

  // Rellenar datos con el usuario logueado
  useEffect(() => {
    if (user) {
      setBillingData((prev) => ({
        ...prev,
        first_name: user.firstName || prev.first_name,
        last_name: user.lastName || prev.last_name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address_1: prev.address_1 || '',
        city: prev.city || '',
        postcode: prev.postcode || '',
      }));
    }
  }, [user]);

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

  // Detectar si el producto seleccionado es "trial"
  const isTrialProduct = TRIAL_PRODUCT_IDS.includes(Number(selectedProduct.id));

  // El total a cobrar AHORA:
  const totalNow = isTrialProduct ? 0 : Number(parseFloat(selectedProduct.price) || 0);

  const isFormValid = () => {
    return (
      billingData.first_name &&
      billingData.last_name &&
      billingData.email &&
      billingData.email.includes('@') &&
      billingData.address_1 &&
      billingData.city &&
      billingData.postcode
    );
  };

  const updateField = (field, value) => {
    setBillingData((prev) => ({ ...prev, [field]: value }));
  };

  const createOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { token } = getToken();
      if (!token) throw new Error('No se encontró token de autenticación');

      const orderData = {
        payment_method: paymentMethod === 'stripe' ? 'stripe' : 'ppcp-gateway',
        payment_method_title: paymentMethod === 'stripe' ? 'Tarjeta / Klarna' : 'PayPal',
        set_paid: false,
        billing: billingData,
        line_items: [
          {
            product_id: selectedProduct.id,
            quantity: 1,
          },
        ],
        customer_id: user?.id,
        status: 'pending',
      };

      const order = await api.createOrder(orderData, token);
      if (!order.id) {
        throw new Error(order.message || 'Error al crear la orden');
      }

      setOrderId(order.id);

      if (paymentMethod === 'stripe') {
        // amount a Stripe: 0 si trial, precio normal si no
        const paymentData = await api.createPaymentIntent(order.id, totalNow, token);

        // CASO 1: Trial
        if (isTrialProduct || paymentData.free_trial) {
          setIsFreeTrial(true);
          setFutureCharge(FUTURE_CHARGE_EUR);

          if (paymentData.client_secret) {
            setClientSecret(paymentData.client_secret);
            setStep('payment');
          } else {
            // Fallback sin método guardado (backend ya pone la orden en processing)
            clearSelectedProduct();
            navigate(`/order-confirmation/${order.id}?trial=true`);
          }
        }
        // CASO 2: Pago normal
        else if (paymentData.client_secret) {
          setIsFreeTrial(false);
          setClientSecret(paymentData.client_secret);
          setStep('payment');
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      } else {
        // PayPal
        setStep('payment');
      }
    } catch (err) {
      setError(err.message || 'Error al procesar la orden');
    } finally {
      setIsLoading(false);
    }
  };


const handlePaymentSuccess = async (paymentDetails) => {
  try {
    const { token } = getToken();

    // Tipo de flujo
    const isSetup = paymentDetails?.type === 'setup_intent' || isFreeTrial || totalNow === 0;
    const isStripePI =
      (paymentDetails?.id && paymentDetails.id.startsWith('pi_')) ||
      paymentDetails?.object === 'payment_intent';
    const isStripeSI =
      (paymentDetails?.id && paymentDetails.id.startsWith('seti_')) ||
      paymentDetails?.type === 'setup_intent';

    // Plan A: confirmar en backend (Stripe)
    if (isStripeSI || isStripePI) {
      try {
        await api.confirmPayment(
          orderId,
          isStripePI ? paymentDetails.id : null,  // payment_intent_id si aplica
          token,
          isStripeSI ? paymentDetails.id : null   // setup_intent_id si aplica
        );
      } catch (confirmError) {
        // No rompemos el flujo; continuamos con verify-intent si es PI
        console.warn('[Checkout] confirm-payment falló, seguimos con verify-intent si es PI:', confirmError);
      }
    }

    // Plan B: verificar directamente el PaymentIntent en Stripe
    if (isStripePI) {
      try {
        await api.verifyIntent(orderId, paymentDetails.id, token);
      } catch (verifyErr) {
        console.warn('[Checkout] verify-intent no pudo confirmar el pedido:', verifyErr);
      }
    }

    // Pasarelas externas (PayPal, etc.)
    if (!isStripePI && !isStripeSI) {
      const txId =
        paymentDetails?.id ||
        paymentDetails?.purchase_units?.[0]?.payments?.captures?.[0]?.id ||
        paymentDetails?.purchase_units?.[0]?.payments?.authorizations?.[0]?.id ||
        'external';

      try {
        await api.updateOrder(
          orderId,
          {
            status: 'processing',
            transaction_id: txId,
            add_note: 'Pago aprobado por pasarela externa',
          },
          token
        );
      } catch (e) {
        console.warn('[Checkout] updateOrder (pasarela externa) avisó:', e);
      }
    }

    clearSelectedProduct();
    navigate(isSetup ? `/order-confirmation/${orderId}?trial=true` : `/order-confirmation/${orderId}`);
  } catch (err) {
    console.error('[Checkout] Error final en handlePaymentSuccess:', err);
    clearSelectedProduct();
    navigate(`/order-confirmation/${orderId}`);
  }
};



  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <>
      <Menu />
      <div className="checkout-page mt-4">
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
                          disabled={isTrialProduct} // En trial, forzamos Stripe (para guardar método)
                        />
                        <span>PayPal</span>
                      </label>
                    </div>
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button onClick={createOrder} disabled={!isFormValid() || isLoading} className="btn-continue">
                    {isLoading ? 'Creando orden...' : 'Continuar al pago'}
                  </button>
                </div>
              )}

              {step === 'payment' && paymentMethod === 'stripe' && clientSecret && (
                <div className="checkout-section">
                  <h2>{totalNow === 0 ? 'Guardar método de pago' : 'Completar pago'}</h2>

                  {error && <div className="error-message">{error}</div>}

                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm
                      orderId={orderId}
                      amount={totalNow}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      isSetupIntent={totalNow === 0}
                    />
                  </Elements>
                </div>
              )}

              {step === 'payment' && paymentMethod === 'paypal' && (
                <div className="checkout-section">
                  <h2>Pagar con PayPal</h2>
                  {error && <div className="error-message">{error}</div>}
                  <PayPalScriptProvider options={{ 'client-id': PAYPAL_CLIENT_ID, currency: 'EUR' }}>
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              reference_id: orderId.toString(),
                              amount: {
                                value: Number(totalNow).toFixed(2),
                                currency_code: 'EUR',
                              },
                            },
                          ],
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
                    {isTrialProduct ? (
                      <>
                        <span className="trial-badge">Prueba gratuita</span>
                        <span className="future-price">
                        {(futureCharge ?? FUTURE_CHARGE_EUR).toFixed(2)}€ después de 14 días
                        </span>
                      </>
                    ) : (
                      `${Number(selectedProduct.price || 0).toFixed(2)}€`
                    )}
                  </div>
                </div>

                <div className="summary-total">
                  <span>Total {totalNow === 0 ? 'hoy' : ''}:</span>
                  <span>{totalNow === 0 ? '0€' : `${Number(totalNow).toFixed(2)}€`}</span>
                </div>

                <div className="summary-benefits">
                  <div>{totalNow === 0 ? '14 días de prueba gratuita' : 'Entrega inmediata'}</div>
                  <div>Pago 100% seguro</div>
                  <div>Soporte incluido</div>
                  {totalNow === 0 && <div>Cancela cuando quieras</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};

export default CheckoutPage;
