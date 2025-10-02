// Script para debuggear el problema de pagos
const accessToken = 'APP_USR-4202436412700220-100122-7978fe1957246bec2b5281c8946ee01b-2726611840';

// Tu dominio real de Vercel
const baseUrl = 'https://front-e-comerce-seven.vercel.app';

async function testPaymentWithRealUrls() {
  const paymentRequest = {
    items: [
      {
        id: "test-1",
        title: "Producto de Prueba",
        description: "Descripción del producto",
        quantity: 1,
        currency_id: "COP",
        unit_price: 1000
      }
    ],
    payer: {
      email: "test@example.com"
    },
    back_urls: {
      success: `${baseUrl}/pago/exito`,
      failure: `${baseUrl}/pago/error`,
      pending: `${baseUrl}/pago/pendiente`
    },
    auto_return: "approved",
    external_reference: "test-debug-123"
  };

  try {
    console.log('🔍 Probando con URLs reales...');
    console.log('Base URL:', baseUrl);
    console.log('Request:', JSON.stringify(paymentRequest, null, 2));
    
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentRequest)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Preferencia creada exitosamente!');
      console.log('ID:', data.id);
      console.log('Init Point (Producción):', data.init_point);
      console.log('Sandbox Init Point:', data.sandbox_init_point);
      console.log('Back URLs:', data.back_urls);
      
      // Verificar si las URLs son accesibles
      console.log('\n🔍 Verificando URLs de retorno...');
      for (const [type, url] of Object.entries(data.back_urls)) {
        try {
          const urlResponse = await fetch(url, { method: 'HEAD' });
          console.log(`${type}: ${url} - Status: ${urlResponse.status}`);
        } catch (error) {
          console.log(`${type}: ${url} - Error: ${error.message}`);
        }
      }
      
    } else {
      console.log('❌ Error al crear preferencia');
      console.log('Status:', response.status);
      console.log('Error:', data);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

console.log('🚀 Iniciando debug de pagos...');
console.log('⚠️  IMPORTANTE: Cambia "tu-dominio.vercel.app" por tu dominio real');
testPaymentWithRealUrls();
