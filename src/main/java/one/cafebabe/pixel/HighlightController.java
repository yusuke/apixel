package one.cafebabe.pixel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HighlightController {

    private final SimpMessagingTemplate template;

    @Autowired
    public HighlightController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @RequestMapping("/api/highlight")
    public ResponseEntity<?> highlightCell(@RequestParam("x") int x,
            @RequestParam("y") int y,
            @RequestParam("color") String color) {
        // WebSocketクライアントにメッセージを送信
        this.template.convertAndSend("/topic/highlight", new HighlightMessage(x, y, color));
        return ResponseEntity.ok().build();
    }

    record HighlightMessage(int x, int y, String color) {
    }
}