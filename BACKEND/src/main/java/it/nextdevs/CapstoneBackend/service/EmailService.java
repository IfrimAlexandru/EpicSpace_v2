package it.nextdevs.CapstoneBackend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${gmail.mail.from}")
    private String fromEmail;

    public Integer sendTicketEmail(String to, String buyerName, String planet, String ship, String suit, String dataPrenotazione, String spaceshipImageUrl, String suitImageUrl, String planetImageUrl) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String capitalizedPlanet = capitalizeFirstLetter(planet);

            String subject = "Il tuo biglietto per il volo spaziale";
            String htmlContent = "<html>" +
                    "<head>" +
                    "<style>" +
                    "@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');" +
                    "body { font-family: 'Montserrat', sans-serif; background-color: #f3f3f3; padding: 20px; }" +
                    ".email-container { max-width: 700px; margin: 0 auto; padding: 20px; background-color: #333; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); color: #ffffff; }" +
                    ".header { text-align: center; padding-bottom: 20px; }" +
                    ".header img { max-width: 250px; }" +
                    ".content { text-align: center; }" +
                    ".details { background-color: #444; padding: 15px; border-radius: 10px; margin-bottom: 20px; }" +
                    ".detail-item { display: flex; align-items: center; margin-bottom: 10px; justify-content: center; }" +
                    ".detail-item .labelP { font-weight: bold; margin-right: 10px; margin-top:45px }" +
                    ".detail-item .labelN { font-weight: bold; margin-right: 10px; margin-top:35px }" +
                    ".detail-item .labelT { font-weight: bold; margin-right: 10px; margin-top:80px }" +
                    ".detail-item .imgP { max-width: 100px; border-radius: 10px; margin-left: 100px; }" +
                    ".detail-item .imgN { max-width: 100px; border-radius: 10px; margin-left: 90px; }" +
                    ".detail-item .imgT { max-width: 100px; border-radius: 10px; margin-left: 119px; }" +
                    ".detail-item .valueP { font-size: 1.8em; margin-left:30px; margin-top:38px }" +
                    ".detail-item .valueN { font-size: 1.8em; margin-left:30px; margin-top:32px }" +
                    ".detail-item .valueT { font-size: 1.8em; margin-left:30px; margin-top:78px }" +
                    ".detail-item .valueD { font-size: 1.2em; margin-left:55px; }" +
                    ".footer { text-align: center; padding-top: 20px; }" +
                    "</style>" +
                    "</head>" +
                    "<body>" +
                    "<div class='email-container'>" +
                    "<div class='header'>" +
                    "<img src='cid:logoImage' alt='EpicSpace Logo' />" +
                    "</div>" +
                    "<div class='content'>" +
                    "<p>Ciao <strong>" + buyerName + "</strong>,</p>" +
                    "<p>Grazie per aver acquistato il biglietto per il volo spaziale. Ecco i dettagli del tuo volo:</p>" +
                    "<div class='details'>" +
                    "<div class='detail-item'>" +
                    "<span class='labelP'>Pianeta:</span>" +
                    "<img class='imgP' src='" + planetImageUrl + "' alt='Pianeta'>" +
                    "<span class='valueP'>" + capitalizedPlanet + "</span>" +
                    "</div>" +
                    "<div class='detail-item'>" +
                    "<span class='labelN'>Navicella:</span>" +
                    "<img class='imgN' src='" + spaceshipImageUrl + "' alt='Navicella'>" +
                    "<span class='valueN'>" + ship + "</span>" +
                    "</div>" +
                    "<div class='detail-item'>" +
                    "<span class='labelT'>Tuta:</span>" +
                    "<img class='imgT' src='" + suitImageUrl + "' alt='Tuta Spaziale'>" +
                    "<span class='valueT'>" + suit + "</span>" +
                    "</div>" +
                    "<div class='detail-item'>" +
                    "<span class='label'>Partenza prevista:</span>" +
                    "<span class='valueD'>" + dataPrenotazione + "</span>" +
                    "</div>" +
                    "</div>" +
                    "<p>Buon viaggio!</p>" +
                    "<p>Saluti,<br>Il team di EpicSpace</p>" +
                    "</div>" +
                    "</div>" +
                    "</body>" +
                    "</html>";


            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true indica che il contenuto è HTML

            // Aggiungi l'immagine inline con content ID 'logoImage'
            ClassPathResource imageResource = new ClassPathResource("/static/assets/img/logo/LOGO.png");
            helper.addInline("logoImage", imageResource);

            mailSender.send(message);
            return 0; // 0 indica successo
        } catch (MessagingException e) {
            logger.error("Errore durante l'invio dell'email a " + to, e);
            return 1; // 1 indica errore
        }
    }

    private String capitalizeFirstLetter(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }
}
