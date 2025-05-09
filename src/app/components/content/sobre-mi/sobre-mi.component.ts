import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-mi',
  imports: [],
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.min.css'
})
export class SobreMiComponent {
  title: string = '¿Quién diseñará la papelería de tu boda?';
  text: string = `¡Hola!
    <br><br>
    Me llamo Cristina, soy diseñadora gráfica y llevo toda mi vida escuchando a los
    <br>
    míos, que mi parte creativa necesitaba su lugar.
    <br><br>
    Kristy&Co Studio nace gracias a las ganas de conectar con las personas y de
    <br>
    transmitir emociones haciendo algo que me apasiona, como poder combinar
    <br>
    diseño de invitaciones con acabados artesanales, un lugar donde mis valores de
    <br>
    positividad, creatividad y empatía cobran vida en cada proyecto.
    <br><br>
    POSITIVIDAD: Creo en la importancia de acompañarte con buena energía
    <br>
    durante todo el proceso creativo.
    <br>
    Cada diseño transmitirá emociones bonitas y optimistas.
    <br><br>
    CREATIVIDAD: No sólo se trata de diseñar, sino que cada colección que diseño
    <br>
    está pensada para contar historias a través de detalles únicos
    <br>
    y acabados que inspiran.
    <br><br>
    EMPATÍA: Mi prioridad es escucharte, entender tus necesidades. Quiero crear una
    <br>
    experiencia cercana y colaborativa para que te sientas parte del proyecto.
    <br>
    Mi misión es ayudar con mi Papelería de Bodas y sueño con hacer felices con la
    <br>
    sencillez de mis diseños a parejas cuyo único objetivo sea
    <br>
    vivir cada momento y disfrutarlo!
    <br><br>
    Creo en la magia de los detalles y los acabados únicos hechos a mano.
    <br>
    En Kristy&Co Studio no sólo creamos papelería bonita, sino piezas que se
    <br>
    conviertan en recuerdos inolvidables. Nuestro objetivo es que al abrir una
    <br>
    invitación, los invitados sientan un adelanto de la magia que les espera.`;

    finalText = `<p>${this.text}</p>`;
}
