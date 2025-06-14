import { Enlaces } from "../../../models/interfaces/enlace.interface";

export const TITLE: string = '¿Tienes dudas? !Estamos aquí para ayudaros¡';

export const TEXT: string = `<p>Planificar cada detalle de vuestra boda puede generar muchas dudas y preguntas, por eso
  <br>
  estamos comprometidos a resolverlas y guiaros en el camino. Ya sea para más información sobre
  <br>
  nuestras colecciones, materiales, inspiración o proceso de diseño, estamos disponibles para vosotros.
  <br><br><br><br>
  Contáctanos para agendar una reunión para conocerte y ayudarte a crear la papelería de tus
  <br>
  sueños a través de nuestro correo electrónico, teléfono o redes sociales.
  <br>
  Juntos, podemos hacer que cada detalle de tu boda sea tan especial
  <br>
  como siempre lo imaginaste.
  <br><br><br>
  Kristy & Co Studio: Diseños con alma, creados con amor.</p>`;

const phoneUrl: string = "+34 684 749 656";
const mailUrl: string = "mailto:kristycostudio@gmail.com";
const whatsappUrl: string = "https://api.whatsapp.com/send?phone=34684749656&text=Hola%20Cristina,%20me%20gustaria%20concertar%20una%20llamada%20contigo%20para%20que%20me%20expliques%20el%20proceso%20completo.";
const instagramUrl: string = "https://www.instagram.com/kristyco_studio/";

const phoneIcon: string = "fa-solid fa-phone";
const mailIcon: string = "fa-solid fa-envelope";
const whatsappIcon: string = "fa-brands fa-whatsapp";
const instagramIcon: string = "fa-brands fa-instagram";

export const LINKS: Enlaces[] = [
  { link: phoneUrl, label: phoneIcon },
  { link: mailUrl, label: mailIcon },
  { link: whatsappUrl, label: whatsappIcon },
  { link: instagramUrl, label: instagramIcon }
]
