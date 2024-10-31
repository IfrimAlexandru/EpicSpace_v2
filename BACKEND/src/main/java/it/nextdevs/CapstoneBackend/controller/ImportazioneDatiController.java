package it.nextdevs.CapstoneBackend.controller;

import it.nextdevs.CapstoneBackend.service.ImportazioneDatiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/importa")
public class ImportazioneDatiController {

    @Autowired
    private ImportazioneDatiService importazioneDatiService;

    @PostMapping("/navi-spaziali")
    public void importaNaviSpaziali(@RequestBody String json) throws IOException {
        importazioneDatiService.importaNaviSpaziali(json);
    }

    @PostMapping("/pianeti")
    public void importaPianeti(@RequestBody String json) throws IOException {
        importazioneDatiService.importaPianeti(json);
    }

    @PostMapping("/tute-spaziali")
    public void importaTuteSpaziali(@RequestBody String json) throws IOException {
        importazioneDatiService.importaTuteSpaziali(json);
    }
}