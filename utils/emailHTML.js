function handlePrice(order) {
  const amount = order.reduce((acc, item) => acc + item.price * item.quantity, 0)
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR'

  })
}

export const productHtml = (order, user) => {
  return `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Template</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
            
         
            <div style="background-color: #1e3a8a; padding: 16px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Placed Succesfully</h1>
            </div>
    
           
            <div style="padding:24px 15px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                Hello <strong class="capitalize">${user.fullName.firstName}  ${user.fullName.lastName}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.5;">
                We're confirm to you that your order has been placed successfully. Your order details are as follows:
              </p>
              
             
            </div>
   <div style="display: flex; justify-content: center; align-items: center; width: 100%;padding:15px;">
  <table style="border-collapse: collapse; width: 95%; border: 1px solid #ccc;">
    <thead>
      <tr style="background-color: #f3f4f6; color: #4b5563; font-size: 0.875rem; font-weight: 500; text-transform: uppercase;">
        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Serial No.</th>
        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: left;">Product Name</th>
        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Quantity</th>
        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${order
      .map(
        (item, index) => `
          <tr style="background-color: ${index % 2 === 0 ? '#f9fafb' : '#ffffff'}; border-bottom: 1px solid #e5e7eb;">
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px;">${item.name}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${item.quantity}</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${item.price}</td>
          </tr>`
      )
      .join('')}
    </tbody>
  </table>

  </div>
  <p style="color: #374151; font-size: 1.2rem; margin-top: 16px;width:95%;text-align:right;padding:0 15px ;">Subtotal: <strong style="font-size: 1rem">${handlePrice(order)}</strong></p>


<div style="background-color: #f9fafb; padding: 16px; text-align: center;">
  <p style="color: #9ca3af; font-size: 14px; margin: 0;">
    &copy; 2025 Shubham limited. All rights reserved.
  </p>
  <p style="color: #9ca3af; font-size: 12px; margin: 0;">
    270, Gurugaon - 110018, India
  </p>
</div>
    
          </div >
        </body >
        </html >
  `
}