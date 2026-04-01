import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components"

interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
}

interface OrderConfirmationEmailProps {
  fullName: string
  orderId: number
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  address: string
  city: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

export function OrderConfirmationEmail({
  fullName,
  orderId,
  items,
  subtotal,
  shipping,
  total,
  address,
  city,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`¡Tu pedido #${orderId} fue recibido! — Tikal Shop`}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "sans-serif", margin: 0, padding: "32px 0" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "16px", overflow: "hidden" }}>

          {/* Header */}
          <Section style={{ backgroundColor: "#15B097", padding: "32px 40px", textAlign: "center" }}>
            <Heading style={{ color: "#ffffff", margin: 0, fontSize: "24px", fontWeight: "800" }}>
              🐟 Tikal Shop
            </Heading>
            <Text style={{ color: "#d1faf5", margin: "8px 0 0", fontSize: "14px" }}>
              Tu tienda de mascotas
            </Text>
          </Section>

          {/* Body */}
          <Section style={{ padding: "32px 40px" }}>
            <Heading as="h2" style={{ fontSize: "20px", color: "#111827", margin: "0 0 8px" }}>
              ¡Pedido confirmado, {fullName}!
            </Heading>
            <Text style={{ color: "#6b7280", margin: "0 0 24px", fontSize: "14px" }}>
              Recibimos tu pedido <strong style={{ color: "#111827" }}>#{orderId}</strong>. Te avisaremos cuando sea enviado.
            </Text>

            {/* Items */}
            <Section style={{ backgroundColor: "#f9fafb", borderRadius: "12px", padding: "16px" }}>
              <Text style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0 0 12px" }}>
                RESUMEN DEL PEDIDO
              </Text>
              {items.map((item, i) => (
                <Row key={i} style={{ marginBottom: "12px" }}>
                  <Column style={{ width: "48px" }}>
                    <Img
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      style={{ borderRadius: "8px", objectFit: "cover" }}
                    />
                  </Column>
                  <Column style={{ paddingLeft: "12px" }}>
                    <Text style={{ margin: 0, fontSize: "13px", color: "#111827", fontWeight: "500" }}>
                      {item.name}
                    </Text>
                    <Text style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      ×{item.quantity}
                    </Text>
                  </Column>
                  <Column style={{ textAlign: "right" }}>
                    <Text style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#111827" }}>
                      {formatPrice(item.price * item.quantity)}
                    </Text>
                  </Column>
                </Row>
              ))}

              <Hr style={{ borderColor: "#e5e7eb", margin: "12px 0" }} />

              <Row>
                <Column><Text style={{ margin: "4px 0", fontSize: "13px", color: "#6b7280" }}>Subtotal</Text></Column>
                <Column style={{ textAlign: "right" }}><Text style={{ margin: "4px 0", fontSize: "13px", color: "#6b7280" }}>{formatPrice(subtotal)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={{ margin: "4px 0", fontSize: "13px", color: "#6b7280" }}>Envío</Text></Column>
                <Column style={{ textAlign: "right" }}>
                  <Text style={{ margin: "4px 0", fontSize: "13px", color: shipping === 0 ? "#15B097" : "#6b7280", fontWeight: shipping === 0 ? "600" : "400" }}>
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column><Text style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>Total</Text></Column>
                <Column style={{ textAlign: "right" }}><Text style={{ margin: "8px 0 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>{formatPrice(total)}</Text></Column>
              </Row>
            </Section>

            {/* Shipping info */}
            <Section style={{ marginTop: "24px", padding: "16px", border: "1px solid #e5e7eb", borderRadius: "12px" }}>
              <Text style={{ fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0 0 8px" }}>
                DIRECCIÓN DE ENTREGA
              </Text>
              <Text style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                {address}, {city}
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={{ backgroundColor: "#f9fafb", padding: "24px 40px", textAlign: "center" }}>
            <Text style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
              ¿Tienes dudas? Responde este correo y te ayudamos.
            </Text>
            <Text style={{ margin: "8px 0 0", fontSize: "12px", color: "#d1d5db" }}>
              © {new Date().getFullYear()} Tikal Shop
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}
