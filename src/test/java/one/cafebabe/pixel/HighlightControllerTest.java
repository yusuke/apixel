package one.cafebabe.pixel;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class HighlightControllerTest {
    private MockMvc mockMvc;
    private SimpMessagingTemplate mockTemplate;

    @BeforeEach
    public void setup() {
        mockTemplate = mock(SimpMessagingTemplate.class);
        HighlightController controller = new HighlightController(mockTemplate);

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testHighlightCell() throws Exception {
        mockMvc.perform(get("/api/highlight")
                        .param("x", "10")
                        .param("y", "20")
                        .param("color", "blue")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        Mockito.verify(mockTemplate, times(1)).convertAndSend("/topic/highlight", new HighlightController.HighlightMessage(10, 20, "blue"));
    }
}