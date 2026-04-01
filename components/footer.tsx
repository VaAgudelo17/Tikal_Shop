import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const footerLinks = {
  tienda: [
    { label: "Acuarios", href: "#" },
    { label: "Perros", href: "#" },
    { label: "Gatos", href: "#" },
    { label: "Mascotas Pequeñas", href: "#" },
    { label: "Aves", href: "#" },
    { label: "Ofertas", href: "#" },
  ],
  soporte: [
    { label: "Contáctanos", href: "#" },
    { label: "Preguntas Frecuentes", href: "#" },
    { label: "Información de Envío", href: "#" },
    { label: "Devoluciones", href: "#" },
    { label: "Rastrear Pedido", href: "#" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Trabaja con Nosotros", href: "#" },
    { label: "Nuestra Tienda", href: "#" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10 sm:py-12 md:py-16">
        <div className="grid gap-8 sm:gap-10 md:gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand section */}
          <div className="sm:col-span-2 lg:col-span-2">
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo-pez.png"
                alt="Tikal Shop Logo"
                width={120}
                height={100}
                className="h-16 w-28 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tikal Shop</span>
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Tu tienda de mascotas</span>
              </div>
            </a>
            <p className="mt-4 max-w-sm text-sm sm:text-base text-muted-foreground">
              Tu destino confiable para productos premium de mascotas y equipos de
              acuarios. Haciendo el cuidado de mascotas fácil desde 2010.
            </p>

            {/* Contact info */}
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="mailto:info@tikalshop.com"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Mail className="h-4 w-4 shrink-0" />
                info@tikalshop.com
              </a>
              <a
                href="tel:+573505003159"
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <Phone className="h-4 w-4 shrink-0" />
                +57 350 500 3159
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>Calle 33a #16-51, La Floresta, Cali, Colombia</span>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Tienda</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Soporte</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Empresa</h4>
            <ul className="flex flex-col gap-2 sm:gap-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6 sm:mt-8">
              <h4 className="mb-3 font-semibold text-foreground">Boletín</h4>
              <p className="mb-3 text-sm text-muted-foreground">
                Obtén 10% de descuento en tu primer pedido
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Tu correo"
                  className="bg-secondary border-0 text-sm"
                />
                <Button size="icon" className="shrink-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:pt-8 md:flex-row">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © 2026 Tikal Shop. Todos los derechos reservados.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Política de Privacidad
            </a>
            <a
              href="#"
              className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
