import { Resend } from "resend"
import { OrderConfirmationEmail } from "@/emails/order-confirmation"

interface SendOrderConfirmationParams {
  to: string
  fullName: string
  orderId: number
  items: { name: string; price: number; quantity: number; image: string }[]
  subtotal: number
  shipping: number
  total: number
  address: string
  city: string
}

export async function sendOrderConfirmation(params: SendOrderConfirmationParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY no configurada, omitiendo email")
    return
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const { to, ...emailProps } = params
  const { error } = await resend.emails.send({
    from: "Tikal Shop <pedidos@tikalboutique.shop>",
    to,
    subject: `¡Tu pedido #${params.orderId} fue recibido! — Tikal Shop`,
    react: OrderConfirmationEmail(emailProps),
  })

  if (error) {
    console.error("Error enviando correo:", error)
  }
}
