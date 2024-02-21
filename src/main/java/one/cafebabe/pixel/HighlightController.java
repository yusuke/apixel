package one.cafebabe.pixel;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public record HighlightController(SimpMessagingTemplate template) {

    @RequestMapping("/api/highlight")
    public ResponseEntity<?> highlightCell(@RequestParam("x") int x, @RequestParam("y") int y,
            @RequestParam("color") String color) {
        this.template.convertAndSend("/topic/highlight", new HighlightMessage(x, y, color));
        return ResponseEntity.ok().build();
    }

    record HighlightMessage(int x, int y, String color) {
    }
}